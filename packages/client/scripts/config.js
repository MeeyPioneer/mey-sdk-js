/* eslint-disable */
import { resolve as _resolve } from 'path';
import node_resolve from '@rollup/plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import { terser } from 'rollup-plugin-terser';
import progress from 'rollup-plugin-progress';
import pkg from '../package.json';
import { builtinModules } from 'module';

const globals = require('rollup-plugin-node-globals');

const version = process.env.VERSION || require('../package.json').version;

const banner =
  '/*!\n' +
  ' * mey-sdk-js v' + version + '\n' +
  ' * (c) ' + new Date().getFullYear() + ' mey\n' +
  ' * Released under MIT license.\n' +
  ' */';

const resolve = p => _resolve(__dirname, '../', p);

// Treating these as external as they are runtime requirements for node only
// Packages from `external` are inlined for the web distribution
const webExternal = [
    'http',
    'https',
    'url'
]

const builds = {
    // CommonJS build (CommonJS)
    'node-cjs': {
        entry: resolve('src/platforms/node/index.ts'),
        dest: resolve('dist/mey-sdk-js.common.js'),
        format: 'cjs',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
            })
        ],
    },
    // CommonJS build (ES Modules)
    'node-esm': {
        entry: resolve('src/platforms/node/index.ts'),
        dest: resolve('dist/mey-sdk-js.esm.js'),
        format: 'es',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
            }),
        ],
    },
    // Development build (Web, for browser or node)
    'web-dev': {
        entry: resolve('src/platforms/web/index.ts'),
        dest: resolve('dist/mey-sdk-js.js'),
        format: 'umd',
        env: 'development',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                jsnext: true,
                main: true,
                browser: true,
                preferBuiltins: false
            }),
            
        ],
        context: 'window',
    },
    // Production build (Web, for browser or node)
    'web-prod': {
        entry: resolve('src/platforms/web/index.ts'),
        dest: resolve('dist/mey-sdk-js.min.js'),
        format: 'umd',
        env: 'production',
        banner,
        plugins: [
            node_resolve({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                jsnext: true,
                main: true,
                browser: true,
                preferBuiltins: false
            }),
            terser()
        ],
        context: 'window',
    },
};

function genConfig (name) {
    const opts = builds[name];
    const browser = name.match(/web/);
    const external = browser ? webExternal : Object.keys(pkg.dependencies).concat(...builtinModules);

    const namedExports = {
        [resolve('types/rpc_pb.js')]: 'AccountAddress, Empty, Personal, SingleBytes, TxList, TxBody, Tx, CommitStatus, ListParams, Query, Name, PeersParams, VoteParams, NodeReq, KeyParams, BlockMetadata, PageParams, BlockBodyParams'.split(', '),
        [resolve('types/node_pb.js')]: 'PeerRole'.split(', '),
        [resolve('types/blockchain_pb.js')]: 'TxList, TxBody, Tx, TxType, Block, Query, StateQuery, FilterInfo'.split(', '),
        [resolve('types/account_pb.js')]: 'Account'.split(', '),
        [resolve('../../node_modules/@improbable-eng/grpc-web/dist/grpc-web-client.umd.js')]: 'grpc'.split(','),
        [resolve('../../node_modules/elliptic/lib/elliptic.js')]: 'ec'.split(', '),
        [resolve('../common/dist/mey-sdk-js-common.umd.js')]: 'Amount'.split(', '),
        [resolve('../common/dist/mey-sdk-js-common.umd.js')]: 'hash'.split(', '),
    };

    const config = {
        input: opts.entry,
        external,
        plugins: [

            commonjs({
                include: [ /node_modules/, 'types/**'  ],
                namedExports
            }),

            json(),

            builtins(),

            babel({
                extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.ts', '.tsx'],
                babelrc: false,
                exclude: 'node_modules/**',
                runtimeHelpers: true,
                plugins: [
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/proposal-class-properties'
                ],
                presets: [
                    ["@babel/preset-env", {
                        "modules": false,
                        "exclude": ["transform-regenerator"]
                    }],
                    "@babel/typescript"
                ]
            }),

            globals(),

            progress(),
        ].concat(opts.plugins || []),
        output: {
            file: opts.dest,
            format: opts.format,
            banner: opts.banner,
            name: 'mey-sdk-js',
            exports: 'named'
        },
        context: opts.context || 'undefined'
    };

    Object.defineProperty(config, '_name', {
        enumerable: false,
        value: name
    });

    return config;
}

if (process.env.TARGET) {
    module.exports = genConfig(process.env.TARGET);
} else {
    exports.getBuild = genConfig;
    exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}