
/*
Run this with
./node_modules/.bin/babel-node test/perf/transactions_node.js
*/
/* eslint no-console: 0 */
import { performance, PerformanceObserver } from 'perf_hooks';
import RateLimit from 'async-sema/rate-limit';

const numberOfTx = 10000;

const waitForTx = true; // wait for tx to complete after sending

const obs = new PerformanceObserver((items) => {
    const entry = items.getEntries()[0];
    const tps = Math.round(numberOfTx / entry.duration * 1000);
    console.log(`${entry.name}: ${entry.duration}ms (${tps} tps)`);
});
obs.observe({ entryTypes: ['measure'] });

function asyncMap(items, fn, concurrencyLimit, rateLimit = 20) {
    const lim = RateLimit(rateLimit); // rps

    return Promise.all(items.reduce((promises, item, index) => {
        const chainNum = index % concurrencyLimit;
        let chain = promises[chainNum];
        if (!chain) {
            chain = promises[chainNum] = Promise.resolve();
        }
        promises[chainNum] = chain.then(async _ => {
            await lim();
            return await fn(item);
        });
        return promises;
    }, []));
}

export async function main(mey) {
    function pollTxStatus(hash) {
        return mey.getTransaction(hash).then((result) => {
            if ('block' in result) {
                return result.block.hash;
            } else {
                return pollTxStatus(hash);
            }
        }).catch(e => {
            return pollTxStatus(hash);
        });
    }

    const createdAddress = await mey.accounts.create('testpass');
    const address = await mey.accounts.unlock(createdAddress, 'testpass');

    // Create transactions
    const transactions = Array.from({ length: numberOfTx }).map((u, i) => ({
        nonce: i + 1,
        from: address,
        to: address,
        amount: i + 1,
        payload: null
    }));

    performance.mark('A');

    // Sign transactions
    const signedTransactions = [];
    await Promise.all(transactions.map(tx => (
        mey.accounts.signTransaction(tx).then((signedtx) => {
            signedTransactions.push(signedtx);
        })
    )));

    performance.mark('B');


    // Commit transactions, limited concurrency
    await asyncMap(signedTransactions, async item => 
        await mey.sendSignedTransaction(item).then((txid) => {
            item.id = txid;
            console.log(`Sent ${txid}`);
        }), 100);

    performance.mark('C');

    if (waitForTx) {
        const blocks = new Set();
        // Wait for transactions to be included in blocks
        await asyncMap(signedTransactions, async tx => 
            await pollTxStatus(tx.id).then(blockhash => {
                tx.blockhash = blockhash;
                console.log(tx.nonce, tx.id, tx.blockhash);
                blocks.add(tx.blockhash);
            }), 100);
        console.log(`(in ${blocks.size} blocks)`);
    } else {
        // Just print tx ids without waiting for confirmation
        for (const tx of signedTransactions) {
            console.log(tx.nonce, tx.id);
        }
    }

    performance.mark('D');

    performance.measure('Transaction sign', 'A', 'B');
    performance.measure('Transaction commit', 'B', 'C');
    if (waitForTx) performance.measure('Transaction confirm', 'C', 'D');
    console.log(`${numberOfTx} tx`);
}

