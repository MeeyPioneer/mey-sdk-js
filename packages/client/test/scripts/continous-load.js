/*
Run this with
./node_modules/.bin/babel-node test/scripts/continous-load.js
*/

import { MeyCoinClient } from '../../src/platforms/node';

const targetTps = 1;
let j = 0;

const mey = new MeyCoinClient();

function pollTxStatus(hash) {
    return mey.getTransaction(hash).then((result) => {
        if ('block' in result) {
            return result.block.hash;
        } else {
            return pollTxStatus(hash);
        }
    });
}

async function step() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async resolve => {
        const createdAddress = await mey.accounts.create('testpass');
        const address = await mey.accounts.unlock(createdAddress, 'testpass');

        // Create transactions
        const transactions = Array.from({ length: targetTps }).map((u, i) => ({
            nonce: i + 1 + j,
            from: address,
            to: address,
            amount: targetTps*100 - i - j,
            payload: null
        }));
        j += targetTps;

        // Sign transactions
        const signedTransactions = [];
        await Promise.all(transactions.map(tx => (
            mey.accounts.signTransaction(tx).then((signedtx) => {
                signedTransactions.push(signedtx);
            })
        )));

        // Commit transactions
        await Promise.all(signedTransactions.map(signedtx => (
            mey.sendSignedTransaction(signedtx).then((txid) => {
                signedtx.id = txid;
            })
        )));

        console.log('Waiting for', signedTransactions.length);
        for (const tx of signedTransactions) {
            console.log(tx.nonce, tx.id, '...');
        }

        // Wait for transactions to be included in blocks
        await Promise.all(signedTransactions.map(tx => (
            pollTxStatus(tx.id).then(blockhash => {
                tx.blockhash = blockhash;
                console.log(tx.nonce, tx.id, tx.blockhash);
            }).catch(e => {
                console.log(tx.nonce, tx.id, 'not found', e);
            })
        )));
        resolve();
    });
}

(async () => {
    for (;;) {
        await step();
    }
})();

