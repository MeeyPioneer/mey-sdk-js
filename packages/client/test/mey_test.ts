import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import MeyCoinClient from '../src';
import Address from '../src/models/address';
import GrpcProvider from '../src/providers/grpc';

import { createIdentity, signTransaction, hashTransaction } from '@mey-sdk-js/crypto';
import { commitTestTransaction } from './utils';

describe('MeyCoin invalid config', () => {
    const invalidUrl = 'invalid';
    const invalidMeyCoin = new MeyCoinClient({}, new GrpcProvider({ url: invalidUrl }));
    describe('isConnected()', () => {
        it('should return false when disconnected', () => {
            assert.equal(invalidMeyCoin.isConnected(), false);
        });
    });

    describe('blockchain()', () => {
        it('should return disconnected error', async () => {
            return assert.isRejected(invalidMeyCoin.blockchain(), Error, '14 UNAVAILABLE: DNS resolution failed');
        });
    });

    describe('getInvalidConfig()', () => {
        it('should return default config', () => {
            assert.equal(invalidMeyCoin.client.config.url, invalidUrl);
        });
    });

    describe('GrpcProvider', () => {
        it('should throw error when protocol is included', () => {
            assert.throws(() => {
                new GrpcProvider({ url: 'http://foo.bar' });
            }, Error, 'URL for GrpcProvider should be provided without scheme (not http)');
            assert.throws(() => {
                new GrpcProvider({ url: 'https://foo.bar' });
            }, Error, 'URL for GrpcProvider should be provided without scheme (not https)');
        });
    });
});

describe('MeyCoin', () => {
    const mey = new MeyCoinClient();
    let bestBlockHash: string;
    let bestBlockNumber: number;

    describe('getDefaultConfig()', () => {
        it('should return default config', () => {
            assert.equal(mey.client.config.url, 'localhost:7845');
        });
    });

    describe('blockchain()', () => {
        it('should return best block hash and number', (done) => {
            mey.blockchain().then((response) => {
                bestBlockHash = response.bestBlockHash;
                bestBlockNumber = response.bestHeight;
                assert.isString(bestBlockHash);
                assert.isNumber(bestBlockNumber);
                done();
            });
        });
    });

    describe('getChainInfo()', () => {
        it('should return basic chain information', async () => {
            const info = await mey.getChainInfo();
            assert.equal(info.chainid.magic, 'dev.chain');
        });
    });

    describe('getServerInfo()', () => {
        it('should return server information', async () => {
            const info = await mey.getServerInfo();
            // @ts-ignore
            assert.equal(info.configMap.get('base').get('personal'), 'true');
            // @ts-ignore
            assert.equal(info.configMap.get('account').get('unlocktimeout'), '60');
            // @ts-ignore
            assert.equal(info.statusMap.get('addr'), '127.0.0.1');
        });
    });

    describe('getNodeState()', () => {
        it('should return node state for all components', async () => {
            const info = await mey.getNodeState();
            assert.equal(info.AccountsSvc.status, 'started');
            assert.isTrue(Object.keys(info).length > 1);
        }).timeout(10000);
        it('should return node state for single components', async () => {
            const info = await mey.getNodeState('RPCSvc');
            assert.equal(info.RPCSvc.status, 'started');
            assert.equal(Object.keys(info).length, 1);
        });
    });

    describe('getConsensusInfo()', () => {
        it('should return consensus information', async () => {
            const info = await mey.getConsensusInfo();
            assert.equal(info.type, 'sbp');
        });
    });

    describe('getPeers()', () => {
        it('should get a list of peers', async () => {
            const peers = await mey.getPeers();
            assert.instanceOf(peers, Array);
            assert.equal(peers[0].acceptedrole, 1);
            assert.equal(peers[0].acceptedroleLabel, 'PRODUCER');
        });
    });

    describe('getBlock()', () => {
        it('should return block info by hash', (done) => {
            mey.getBlock(bestBlockHash).then((response) => {
                assert.equal(response.header.blockno, bestBlockNumber);
                done();
            });
        });
        it('should return block info by number', (done) => {
            mey.getBlock(bestBlockNumber).then((response) => {
                assert.deepEqual(response.hash, bestBlockHash);
                done();
            });
        });
        it('should throw error when hash invalid', () => {
            return assert.isRejected(
                mey.getBlock('111'),
                Error,
                'Invalid block hash. Must be 32 byte encoded in bs58. Did you mean to pass a block number?'
            );
        });
        it('should throw error when argument is missing', () => {
            return assert.isRejected(
                // @ts-ignore
                mey.getBlock(),
                Error,
                'Missing argument block hash or number'
            );
        });
        it('should throw error when block not found by number', async () => {
            return assert.isRejected(
                mey.getBlock(0xFFFFFFFFFFFFFFF),
                Error,
                '13 INTERNAL: block not found: blockNo=1152921504606846976'
            );
        });
        it('should throw error when block not found by hash', async () => {
            return assert.isRejected(
                mey.getBlock('3ntLyinxwZ3W51AWms4UPjjBHW4CDQHqmrP5NmgmmEZ4'),
                Error,
                'block not found'
            );
        });
        it('should throw error when number out of range', () => {
            return assert.isRejected(
                mey.getBlock(0xFFFFFFFFFFFFFFFF),
                Error,
                'Number exeeds range'
            );
        });
    });

    describe('getBlock() and getMetadata()', () => {
        it('should return block info by hash', async () => {
            const block = await mey.getBlock(bestBlockHash);
            const blockMetadata = await mey.getBlockMetadata(bestBlockHash);
            assert.equal(block.body.txsList.length, blockMetadata.txcount);
            assert.equal(block.header.prevblockhash, blockMetadata.header.prevblockhash);
        });
    });

    describe('getBlockStream()', () => {
        it('should stream new blocks', (done) => {
            const stream = mey.getBlockStream();
            try {
                let countBlocks = 3;
                stream.on('data', (blockHeader) => {
                    countBlocks -= 1;
                    assert.isTrue(Object.prototype.hasOwnProperty.call(blockHeader, 'hash'));
                    if (countBlocks == 0) {
                        stream.cancel();
                        done();
                    }
                });
            } catch (e) {
                stream.cancel();
                done(e);
            }
        }).timeout(5000);
    });

    describe('getBlockMetadataStream()', () => {
        it('should stream new block metadata', (done) => {
            const stream = mey.getBlockMetadataStream();
            try {
                let countBlocks = 3;
                stream.on('data', (blockMetadata) => {
                    countBlocks -= 1;
                    assert.isTrue(Object.prototype.hasOwnProperty.call(blockMetadata, 'hash'));
                    assert.isTrue(Object.prototype.hasOwnProperty.call(blockMetadata.header, 'blockno'));
                    assert.typeOf(blockMetadata.txcount, 'number');
                    assert.typeOf(blockMetadata.size, 'number');
                    if (countBlocks == 0) {
                        stream.cancel();
                        done();
                    }
                });
            } catch (e) {
                stream.cancel();
                done(e);
            }
        }).timeout(5000);
    });

    describe('getBlockHeaders()', () => {
        it('should get list of last block headers by block height', async () => {
            const blockchainState = await mey.blockchain();
            const height = blockchainState.bestHeight;
            const list = await mey.getBlockHeaders(height);
            assert.equal(list[0].hash, blockchainState.bestBlockHash);
            const listAsc = await mey.getBlockHeaders(height, 10, 0, false);
            assert.equal(listAsc[listAsc.length - 1].hash, blockchainState.bestBlockHash);
        });
        it('should get list of last block headers by block hash', async () => {
            const blockchainState = await mey.blockchain();
            const hash = blockchainState.bestBlockHash;
            const list = await mey.getBlockHeaders(hash);
            assert.equal(list[0].header.blockno, blockchainState.bestHeight);
        });
    });

    describe('getState()', () => {
        let testaddress: Address;
        beforeEach(async () => {
            testaddress = await mey.accounts.create('testpass');
        });

        it('should return state info by account address', async () => {
            const state = await mey.getState(testaddress);
            assert.equal(state.nonce, 0);
            assert.equal(state.balance.toUnit('mey').toString(), '20000 mey');
        });

        it('should return error for invalid address', () => {
            assert.throws(() => {
                mey.getState('invalidinvalidinvalid');
            }, Error, 'Non-base58 character');
        });

        /*
        it('should return error for not found name', async () => {
            const result = await mey.getState('notregister');
            console.log(result);
        });
        */
    });

    describe('getNonce()', () => {
        let testaddress: Address;
        let txhash: string;
        let blockhash: string;

        it('should return nonce of account address', async () => {
            testaddress = await mey.accounts.create('testpass');
            const nonce = await mey.getNonce(testaddress);
            assert.equal(nonce, 0);
        });

        it('should update nonce after submitting transaction', async () => {
            await mey.accounts.unlock(testaddress, 'testpass');
            const tx = {
                from: testaddress,
                to: testaddress,
                amount: '1337 gas',
                chainIdHash: await mey.getChainIdHash()
            };
            // @ts-ignore
            txhash = await mey.accounts.sendTransaction(tx);
            const receipt = await mey.waitForTransactionReceipt(txhash);
            blockhash = receipt.blockhash;
            return mey.getNonce(testaddress).then((nonce) => {
                assert.equal(nonce, 1);
            });
        }).timeout(6500);

        it('should return transaction hash in block', async () => {
            const result = await mey.getBlock(blockhash);
            const txs = result.body.txsList.filter(tx => tx.hash === txhash);
            assert.equal(txs.length, 1);
            assert.equal(txs[0].amount.toString(), '1337 gas');
        });
    });

    describe('getTransaction()', () => {
        let testtx: any;
        beforeEach(async () => {
            const created = await mey.accounts.create('testpass');
            const unlocked = await mey.accounts.unlock(created, 'testpass');
            assert.deepEqual(created.value, unlocked.value);
            const address = unlocked;
            const unsignedtx = {
                nonce: 1,
                from: address,
                to: address,
                amount: '123 gas',
                payload: '',
                chainIdHash: await mey.getChainIdHash()
            };
            // Tx is signed and submitted correctly
            testtx = await mey.accounts.signTransaction(unsignedtx);
            await mey.sendSignedTransaction(testtx);
        });
        it('should return transaction info by hash', async () => {
            const result = await mey.getTransaction(testtx.hash);
            assert.equal(result.tx.hash, testtx.hash);
        });
    });

    describe('sendLocallySignedTransaction()', () => {
        it('should return hash for comitted tx', async () => {
            const identity = createIdentity();
            const tx = {
                nonce: 1,
                from: identity.address,
                to: identity.address,
                amount: '100 gas',
                chainIdHash: await mey.getChainIdHash(),
                sign: null,
                hash: null,
            } as any;
            tx.sign = await signTransaction(tx, identity.keyPair);
            tx.hash = await hashTransaction(tx, 'bytes');
            const txhash = await mey.sendSignedTransaction(tx);
            assert.typeOf(txhash, 'string');
            const commitedTx = await mey.getTransaction(txhash);
            assert.equal(commitedTx.tx.amount.toString(), tx.amount.toString());
        });
        it('should send multiple tx succesfully', async () => {
            const identity = createIdentity();
            const tx1 = {
                nonce: 1,
                from: identity.address,
                to: identity.address,
                amount: '100 gas',
                chainIdHash: await mey.getChainIdHash(),
                sign: null,
                hash: null,
            } as any;
            const tx2 = { ...tx1, nonce: 2 };
            const txs = [tx1, tx2];
            for (const tx of txs) {
                tx.sign = await signTransaction(tx, identity.keyPair);
                tx.hash = await hashTransaction(tx, 'base58');
            }
            const results = await mey.sendSignedTransaction(txs);
            assert.equal(results.length, 2);
            // @ts-ignore
            assert.isFalse(results.some(res => res.error), 'there should be no errors');
            // @ts-ignore
            assert.isTrue(results.every(res => res.hash), 'there should be hashes in the result');
            for (const [index, res] of results.entries()) {
                assert.equal(txs[index].hash, res.hash);
            }
        });
        it('should send multiple tx with some error', async () => {
            const identity = createIdentity();
            const tx1 = {
                nonce: 1,
                from: identity.address,
                to: identity.address,
                amount: '100 gas',
                chainIdHash: await mey.getChainIdHash(),
                sign: null,
                hash: null,
            } as any;
            const tx2 = { ...tx1 }; // Error: duplicate nonce
            const txs = [tx1, tx2];
            for (const tx of txs) {
                tx.sign = await signTransaction(tx, identity.keyPair);
                tx.hash = await hashTransaction(tx, 'base58');
            }
            const results = await mey.sendSignedTransaction(txs);
            assert.equal(results.length, 2);
            // @ts-ignore
            const failedTx = results.find(res => res.error);
            assert.match(failedTx.error, /already in mempool/);
            // @ts-ignore
            const successTx = results.find(res => res.hash);
            if (successTx) {
                const commitedTx = await mey.getTransaction(successTx.hash);
                assert.equal(commitedTx.tx.amount.toString(), txs[0].amount.toString());
            }
        });
    });

    describe('getBlockMetadata and getBlockBody', () => {
        it('should retrieve metadata and body separately', async () => {
            const commitedTx = await commitTestTransaction(mey);

            // @ts-ignore
            const metadata = await mey.getBlockMetadata(commitedTx.block.hash);
            // @ts-ignore
            const body = await mey.getBlockBody(commitedTx.block.hash);

            assert.isAtLeast(metadata.txcount, 1);
            assert.equal(metadata.txcount, body.body.txsList.length);
            assert.equal(metadata.txcount, body.total);
            // @ts-ignore
            assert.equal(metadata.hash, commitedTx.block.hash);
            const tx = body.body.txsList.find(tx => tx.hash === commitedTx.tx.hash);
            if (!tx) throw new Error('could not find tx');
            assert.equal(tx.from.toString(), commitedTx.tx.from.toString());
        });
        it('should page getBlockBody', async () => {
            const commitedTx = await commitTestTransaction(mey);

            // @ts-ignore
            const body = await mey.getBlockBody(commitedTx.block.hash, 0, 1);
            assert.isAtLeast(body.total, 1);
            assert.equal(body.body.txsList.length, 1);

            // @ts-ignore
            const body2 = await mey.getBlockBody(commitedTx.block.hash, 1, 1);
            assert.equal(body2.total, body.total);
            assert.isBelow(body2.body.txsList.length, body2.total);
        });
    });


    describe.skip('getVotingResult()', () => {
        it('should return given number of voting result', async () => {
            const voteList = await mey.getTopVotes(10);
            assert.typeOf(voteList, 'Array');
        });
    });
});
