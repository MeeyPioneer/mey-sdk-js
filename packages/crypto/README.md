# Multi-purpose javascript crypto library for mey

[![npm](https://img.shields.io/npm/v/@mey-sdk-js/crypto.svg)](https://www.npmjs.com/package/@mey-sdk-js/crypto) [![readthedocs](https://readthedocs.org/projects/mey-sdk-js/badge/)](https://mey-sdk-js.readthedocs.io/)

- [Documentation](https://mey-sdk-js.readthedocs.io/)

It is used by MeyCoin dApps to manage keys and sign transactions offline.

Features:

- Key generation and importing
- Hashing
- Signing
- Simple AES-GCM encryption


## How to use

```shell
npm install --save @mey-sdk-js/crypto
```

### Transaction signing

```js
import { createIdentity, signTransaction, hashTransaction } from '@mey-sdk-js/crypto';

async () => {
    const identity = createIdentity();
    const tx = {
        nonce: 1,
        from: identity.address,
        to: identity.address,
        amount: '100 gas',
        payload: '',
    };
    tx.sign = await signTransaction(tx, identity.keyPair);
    tx.hash = await hashTransaction(tx);
    console.log(JSON.stringify(tx));
}()
```

### Arbitrary message signing

```js
import { createIdentity, signMessage, verifySignature, publicKeyFromAddress } from '@mey-sdk-js/crypto';

async () => {
    const identity = createIdentity();
    const msg = Buffer.from('hello');
    const signature = await signMessage(msg, identity.keyPair);
    const pubkey = publicKeyFromAddress(identity.address);
    const check = await verifySignature(msg, pubkey, signature);
    console.log(check);
}()
```