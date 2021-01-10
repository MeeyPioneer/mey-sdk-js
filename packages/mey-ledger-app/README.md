#MeyCoin Ledger App JavaScript bindings

[![npm](https://img.shields.io/npm/v/@mey-sdk-js/mey-ledger-app.svg)](https://www.npmjs.com/package/@mey-sdk-js/mey-ledger-app)

## How to use

```shell
npm install --save @mey-sdk-js/mey-pedger-app
```

### Getting address and signing transaction

```js
import MeyCoinLedgerApp from '@mey-sdk-js/mey-ledger-app';
// Pick a transport. See https://github.com/LedgerHQ/ledgerjs
import Transport from '@ledgerhq/hw-transport-node-hid';
import MeyCoinClient, { Tx } from '@mey-sdk-js/client';

async () => {
    const mey = new MeyCoinClient();
    const transport = await Transport.create(3000, 1500);
    const app = new MeyCoinLedgerApp(transport);
    const path = "m/44'/441'/0'/0/" + i;
    const address = await app.getWalletAddress(path);
    const tx = {
        from: address,
        to: address,
        chainIdHash: await mey.getChainIdHash(),
        type: Tx.Type.TRANSFER,
        nonce: await mey.getNonce(address) + 1,
        limit: 100000,
        nonce: 1,
    };
    const result = await app.signTransaction(tx); // { hash, signature }
    tx.sign = result.signature;
    tx.hash = await hashTransaction(tx, 'bytes');
    const txHash = await mey.sendSignedTransaction(tx);
    const txReceipt = await mey.waitForTransactionReceipt(txHash); // { status: 'SUCCESS', blockno: number, ... }
}()
```
