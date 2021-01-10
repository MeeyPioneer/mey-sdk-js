import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;
import 'regenerator-runtime/runtime';

import { Wallet } from '../src/wallet';
import { GrpcProvider } from '@mey-sdk-js/client';

describe('Wallet: chain configuration', () => {
    it('uses default chain', () => {
        const wallet = new Wallet();
        assert.equal(wallet.defaultChainId, 'testnet.mey.io');
    });
    it('uses first defined chain', () => {
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'foobarchain',
            nodeUrl: 'foobarchain.com:7845'
        });
        assert.equal(wallet.defaultChainId, 'foobarchain');
    });
    it('throws error on config missing nodeUrl', () => {
        const wallet = new Wallet();
        assert.throws(() => {
            wallet.useChain({
                chainId: 'foobarchain'
            });
        }, Error, 'supply nodeUrl in chain config or instantiate provider manually');
    });
    it('uses custom provider', async () => {
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'foobarchain',
            provider: new GrpcProvider({ url: '165.22.49.15:7845' })
        });
        assert.equal(wallet.defaultChainId, 'foobarchain');
        const chainInfo = await wallet.getClient().getChainInfo();
        assert.equal(chainInfo.chainid.magic, 'dev.chain');
    });
    it('throws when using not defined chain', () => {
        const wallet = new Wallet();
        assert.throws(() => {
            wallet.setDefaultChain('not-configured');
        }, Error, 'configure chain not-configured using useChain() before setting it as default');
    });
    it('switches around default chains', () => {
        const wallet = new Wallet();
        wallet.useChain({
            chainId: 'foobarchain',
            nodeUrl: 'foobarchain.com:7845'
        });
        wallet.useChain({
            chainId: 'testnet.mey.io',
            nodeUrl: 'testnet.mey.io:7845'
        });
        assert.equal(wallet.defaultChainId, 'foobarchain');
        wallet.setDefaultChain('testnet.mey.io');
        assert.equal(wallet.defaultChainId, 'testnet.mey.io');

        wallet.useChain({
            chainId: 'testnet.localhost',
            nodeUrl: '165.22.49.15:7845'
        });
        wallet.setDefaultChain('testnet.localhost');
        assert.equal(wallet.defaultChainId, 'testnet.localhost');
    });
});
