import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import MeyCoinClient from '../src';
import Address from '../src/models/address';

import { longPolling } from '../src/utils';

import JSBI from 'jsbi';
import { Amount } from '@mey-sdk-js/common';

describe('MeyCoin.Accounts', () => {
    const mey = new MeyCoinClient(); //default connect to 165.22.49.15:7845
    let testAddress: string | Address = 'INVALIDADDRESS';
    beforeEach(async ()=>{
        const created = await mey.accounts.create('testpass');
        const unlocked = await mey.accounts.unlock(created, 'testpass');
        assert.deepEqual(created.value, unlocked.value);
        testAddress = unlocked;
    });

    describe('create()', () => {
        it('should return created base58 encoded address', async () => {
            testAddress = await mey.accounts.create('testpass');
            assert.isString(testAddress.toString());
        });
    });

    describe('get()', () => {
        it('should return address list in the mey node', (done) => {
            mey.accounts.get().then((accounts) => {
                assert.isArray(accounts);
                done();
            });
        });
    });

    describe('unlock()', () => {
        it('should return unlocked address', (done) => {
            mey.accounts.unlock(testAddress, 'testpass').then((address) => {
                assert.isString(address.toString());
                done();
            });
        });
    });

    describe('lock()', () => {
        it('should return locked address', (done) => {
            mey.accounts.lock(testAddress, 'testpass').then((address) => {
                assert.isString(address.toString());
                done();
            });
        });
    });

    describe('sendTransaction()', () => {
        it('should return hash for signed and comitted tx', async () => {
            await mey.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: testAddress,
                amount: '123 gas',
                chainIdHash: await mey.getChainIdHash()
            };
            // @ts-ignore
            const txhash = await mey.accounts.sendTransaction(testtx);
            assert.typeOf(txhash, 'string');
        });
        it('should send to a name', async () => {
            const name = '' + (Math.random() * 99999999999 + 100000000000).toFixed(0);
            await mey.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: 'mey.name',
                amount: '1 mey',
                payload: `{"Name":"v1createName","Args":["${name}"]}`,
                type: 1,
                chainIdHash: await mey.getChainIdHash(),
            };
            // @ts-ignore
            const txhash = await mey.accounts.sendTransaction(testtx);
            await mey.waitForTransactionReceipt(txhash, 2000);

            const testtx2 = {
                from: testAddress,
                to: name,
                chainIdHash: await mey.getChainIdHash()
            };
            // @ts-ignore
            await mey.accounts.sendTransaction(testtx2);
        }).timeout(3000);
        it('should error when sending to unregistered name', async () => {
            const name = '' + (Math.random() * 99999999999 + 100000000000).toFixed(0);
            await mey.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: name,
                chainIdHash: await mey.getChainIdHash()
            };
            // @ts-ignore
            return assert.isRejected(mey.accounts.sendTransaction(testtx), 'UNDEFINED_ERROR: tx invalid recipient');
        });
    });

    describe('signTX()', () => {
        it('should return tx which has a unlocked account sign', async () => {
            const testtx = {
                nonce: 1,
                from: testAddress,
                to: testAddress,
                amount: '123 gas',
                payload: null,
                chainIdHash: await mey.getChainIdHash()
            };
            // @ts-ignore
            return mey.accounts.signTransaction(testtx)
                // @ts-ignore
                .then((result) => {
                    assert.equal(testtx.nonce, result.nonce);
                    assert.deepEqual(testtx.from.toString(), result.from.toString());
                    assert.typeOf(result.sign, 'string');
                });
        });
    });

    describe('sendSignedTransaction()', () => {
        it('should sign, commit, and retrieve transaction', async () => {
            const createdAddress = await mey.accounts.create('testpass');
            const address = await mey.accounts.unlock(createdAddress, 'testpass');
            assert.deepEqual(address.value, createdAddress.value);
            const testtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: '123 gas',
                payload: null,
                chainIdHash: await mey.getChainIdHash()
            };
            // Tx is signed and submitted correctly
            // @ts-ignore
            const tx = await mey.accounts.signTransaction(testtx);
            const txhash = await mey.sendSignedTransaction(tx);
            assert.typeOf(txhash, 'string');

            // Tx has receipt
            const txReceipt = await mey.waitForTransactionReceipt(txhash);
            assert.isTrue(txReceipt.fee.equal(new Amount('5000000000000000 gas')), `Wrong fee: ${txReceipt.fee}`);
            assert.isTrue(txReceipt.cumulativefee.equal(0), `Wrong cumulativefee: ${txReceipt.cumulativefee}`);
            
            // Tx can be retrieved again
            const tx2 = await mey.getTransaction(txhash);
            assert.equal(tx2.tx.hash, tx.hash);
            assert.isTrue(tx2.tx.amount.equal(tx.amount.value as JSBI));
            // @ts-ignore
            assert.equal(txReceipt.blockhash, tx2.block.hash);

            // Submitting same tx again should error
            return assert.isRejected(mey.sendSignedTransaction(tx));
        }).timeout(5000);
        it('should catch a max payload error', async () => {
            const createdAddress = await mey.accounts.create('testpass');
            const address = await mey.accounts.unlock(createdAddress, 'testpass');
            assert.deepEqual(address.value, createdAddress.value);
            const testtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: '123 gas',
                payload: Buffer.allocUnsafe(250000).fill(1),
                chainIdHash: await mey.getChainIdHash()
            };
            const tx = await mey.accounts.signTransaction(testtx);
            return assert.isRejected(
                mey.sendSignedTransaction(tx),
                Error, 'UNDEFINED_ERROR: size of tx exceeds max length'
            );
        });
    });

    describe('signTX(),sendSignedTransaction()Multiple', () => {
        it('should not timeout', async () => {
            const createdAddress = await mey.accounts.create('testpass');
            const address = await mey.accounts.unlock(createdAddress, 'testpass');
            for (let i = 1; i <= 20; i++) {
                const testtx = {
                    nonce: i,
                    from: address,
                    to: createdAddress,
                    amount: `${i} gas`,
                    chainIdHash: await mey.getChainIdHash()
                };
                const signedtx = await mey.accounts.signTransaction(testtx);
                const txhash = await mey.sendSignedTransaction(signedtx);
                assert.typeOf(txhash, 'string');
            }
        }).timeout(10000);
    });

    describe('getNameInfo()', () => {
        it('should return account information for name', async () => {
            const name = '' + (Math.random() * 99999999999 + 100000000000).toFixed(0);
            await mey.accounts.unlock(testAddress, 'testpass');
            const testtx = {
                from: testAddress,
                to: 'mey.name',
                amount: '1 mey',
                payload: `{"Name":"v1createName","Args":["${name}"]}`,
                type: 1,
                chainIdHash: await mey.getChainIdHash()
            };
            // @ts-ignore
            const txhash = await mey.accounts.sendTransaction(testtx);
            await longPolling(async () => {
                return await mey.getTransaction(txhash);
            }, result => 'block' in result, 2000);

            const info = await mey.getNameInfo(name);
            assert.equal(info.owner.toString(), testAddress);
            assert.equal(info.destination.toString(), testAddress);
        });
    });
});