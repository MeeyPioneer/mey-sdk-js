# mey-sdk-js

[![Travis_ci](https://travis-ci.org/meycoin/mey-sdk-js.svg?branch=master)](https://travis-ci.org/meycoin/mey-sdk-js) [![Greenkeeper badge](https://badges.greenkeeper.io/meycoin/mey-sdk-js.svg)](https://greenkeeper.io/)

Javascript SDK for MeyCoin Platform

[Documentation](https://mey-sdk-js.readthedocs.io/)

Javascript client SDK for the MeyCoin Platform

- [@mey-sdk-js/client](./packages/client): API client, basic models/utils (contract, address, encoding, amounts)
- [@mey-sdk-js/crypto](./packages/crypto): key generation, hashing, signing
- [@mey-sdk-js/wallet](./packages/wallet): stateful key manager, account tracking, tx tracking, storage

## Contribute

### Setup

Clone this repository and run

```console
yarn
```

### Scripts

Run tests (requires a local MeyCoin node running in `--testmode`, listening on port `7845`).

```console
yarn run build
```
```console
yarn test
```

Regenerate GRPC type definitions

```console
yarn run lerna run grpc --scope=@mey-sdk-js/client
```
```console
yarn run build [--scope=@mey-sdk-js/client]
```