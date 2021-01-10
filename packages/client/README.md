# @mey-sdk-js/client

- [Documentation](https://mey-sdk-js.readthedocs.io/)
- [Changelog](./CHANGELOG.md)

This package includes the API client and common classes and utils.

This package supports both Node.js and Web platforms. Please refer to the documentation how to select the platform.

## Quick start

```console
npm install @mey-sdk-js/client
```

You can import the module both as CommonJS (require) and ES module (import).

```javascript
import MeyCoinClient from '@mey-sdk-js/client';
let mey = new MeyCoinClient();
mey.blockchain().then(result => {
    console.log('Current state', result);
});
```

Note that this by default imports the Node.js version which is not compatible with browsers. If you target web browsers, either `import MeyCoinClient from '@mey-sdk-js/client/dist/mey-sdk-js.js';` or create an alias in your bundler configuration. Many bundlers like Webpack automatically pick the browser version, so you don't need to configure anything.

You can also directly import the pre-built bundle in HTML using `<script src="mey-sdk-js/dist/mey-sdk-js.min.js"></script>` and use the global `mey-sdk-js` variable.

## Contribute

### Setup

Clone this repository and run

```console
npm install
```

### Scripts

Run tests (requires a local meysvr node running in `--testmode`, listening on port `7845`).

```console
npm run test
```

Regenerate GRPC type definitions

```console
npm run grpc
```

Development build with auto-update

```console
npm run dev
```

Build all targets for distribution

```console
npm run build
```
