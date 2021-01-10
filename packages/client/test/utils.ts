import MeyCoinClient from '../src';
import { longPolling } from '../src/utils';

import { GetTxResult } from '../src/client/types';

export function waitFor(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

export async function commitTestTransaction(mey: MeyCoinClient): Promise<GetTxResult> {
    const createdAddress = await mey.accounts.create('testpass');
    const address = await mey.accounts.unlock(createdAddress, 'testpass');
    const testtx = {
        nonce: 1,
        from: address,
        to: address,
        amount: '123 gas',
        payload: null,
        chainIdHash: await mey.getChainIdHash()
    };
    // @ts-ignore
    const tx = await mey.accounts.signTransaction(testtx);
    const txhash = await mey.sendSignedTransaction(tx);
    await waitFor(500);
    return await longPolling(async () => {
        return await mey.getTransaction(txhash);
    }, result => 'block' in result, 5000);
}