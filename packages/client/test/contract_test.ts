import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import MeyCoinClient from '../src';
//import MeyCoinClient from '../dist/mey-sdk-js.esm';

// @ts-ignore
import contractAbi from './fixtures/contract-inc.abi.json';
//import sqlContractAbi from './fixtures/contract-sql.abi.json';
import Contract from '../src/models/contract';
import { longPolling } from '../src/utils';
import Address from '../src/models/address';
import { identityFromPrivateKey, hashTransaction, signTransaction } from '@mey-sdk-js/crypto';
import { Buffer } from 'buffer';

describe('Contracts', () => {
    const mey = new MeyCoinClient();

    describe('deploy, call, query a simple contract', () => {
        const contractCode = 'RT4ybGApGoUrNWoisFAAnc1K8gGGd8VCdbbnXBYgpRyd87CWuj3krKobcV7B8vyY15XbHobWEZBX1drFDTU62ufapcP9u1PmibQiXt1FY3YS3v5ZYuH1vuekEWBES4yoWzhJoPFLDCZWdmxYM2manPHLJwefSb6WnYrcmT3Cbpf9266E3eQjsEhbKrZ3CX5FuU8v4MQbsmFhhBfB5S57T3EnzfHTcbSLFwLgvH5DSxEBYoDh2hLcs7e5As6qHvbL8yAQMp7Tz9KH8METfb63ywvGbBPLYQfgdg2kC2DbKdtNroX8seVzznC5SCFPLU6aZAcQnuLuApfcBntEQwsvf5HpEFyJjqEZAhwDSHo3EP8hG1LuKANe5mqCEW9nEVsyV9mGnpAz1Y9eXcQbAgvyVfyvZETpb78h5hZuwNXi2UQh53SKBRyTnc5JS33dTZNR1SRitfX9rZHcowF6pK4a6iptdBwZTu4LcrRC64rqxB928pxYC7Ejh6pLgd7H1GP9v3FmD64Zhy2fEYKMS2jkFCFESYX4gP17Sm4xMw7H8fUDCwcGovTDSd4kkwq8p5HhMpVt9AZMzR7e5vpGJTa9XAve8LjxRbJH4y683Nt1NbEPQWnR9QuJUyQv5SUKi9t9R3rpNvAzmeLNXnmH8qifrZwmpuHhKvG6E7CZ4fe59aBLwabUAEZ8woJ1RXupqDAm69Y7pqZST6Fk5tT4PTspnWir15MiZAgDFKb59vAdUrJso6FLvDTmBWzZBp9MHaQ8DP5E11aEBLzvyas75pYT8ZBiLYbnYcSHfVwmavDGHPx7bp8xtt2vgw7pN';
        let contractAddress: Address;
        let testAddress: Address;
        let deployTxhash: string;

        it('should deploy a smart contract', async () => {
            testAddress = await mey.accounts.create('test');
            await mey.accounts.unlock(testAddress, 'test');

            // Deploy contract
            const contract = Contract.fromCode(contractCode);
            const testtx = {
                from: testAddress,
                to: null,
                payload: contract.asPayload([10]),
                chainIdHash: await mey.getChainIdHash(),
            };
            deployTxhash = await mey.accounts.sendTransaction(testtx);
            assert.typeOf(deployTxhash, 'string');
            
            // Wait for deployment receipt
            const receipt = await longPolling(async () => 
                await mey.getTransactionReceipt(deployTxhash), result => Object.prototype.hasOwnProperty.call(result, 'contractaddress'), 2000);
            assert.equal(receipt.status, 'CREATED', `Deployment failed with error: ${receipt.result}`);
            assert.isAbove(receipt.gasused, 0);
            contractAddress = receipt.contractaddress;
        }).timeout(2100);

        it('should get a smart contract\'s ABI', async () => {
            const abi = await mey.getABI(contractAddress);
            // getABI returns fields that are not currently in the ABI generated by meyluac
            const abiFiltered = {
                ...abi,
                functions: abi.functions.map((func: any) => ({
                    name: func.name,
                    arguments: func.arguments,
                })),
                // eslint-disable-next-line @typescript-eslint/camelcase
                state_variables: abi.state_variables.map((variable: any) => ({
                    name: variable.name,
                    type: variable.type,
                }))
            };
            assert.deepEqual(abiFiltered, contractAbi);
        });

        it('should load ABI from smart contract', async () => {
            const contract = Contract.atAddress(contractAddress);
            contract.loadAbi(await mey.getABI(contractAddress));
            // @ts-ignore
            assert.typeOf(contract.inc, 'function');
        });

        it('should call a smart contract', async () => {
            // Setup address and ABI
            const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);

            // Call contract
            // @ts-ignore
            const callTx = contract.inc().asTransaction({
                from: testAddress,
                chainIdHash: await mey.getChainIdHash(),
            });
            assert.equal(callTx.from, testAddress);
            const calltxhash = await mey.accounts.sendTransaction(callTx);
            const calltxreceipt = await longPolling(async () => 
                await mey.getTransactionReceipt(calltxhash)
            );
            assert.equal(calltxreceipt.status, 'SUCCESS', `Call failed with error: ${calltxreceipt.result}`);

            // Test missing from address
            assert.throws(() => {
                // @ts-ignore
                mey.accounts.sendTransaction(contract.inc().asTransaction());
            }, Error, 'Missing required transaction parameter \'from\'. Call with asTransaction({from: ...})');
            assert.throws(() => {
                // @ts-ignore
                mey.accounts.sendTransaction(contract.inc().asTransaction({
                    from: null,
                }));
            }, Error, 'Missing required transaction parameter \'from\'. Call with asTransaction({from: ...})');
        });

        it('should create a locally signed call tx', async () => {
            // Use a fixed key so we always get the same sign and hash
            const privKey = Buffer.from([8,2,18,32,181,50,7,214,107,164,248,113,106,185,37,184,128,246,154,14,30,242,56,174,161,62,156,169,90,82,212,188,170,47,67,95]);
            const identity = identityFromPrivateKey(privKey);

            const contract = Contract.fromAbi(contractAbi).setAddress('AmNwCvHhvyn8tVb6YCftJkqsvkLz2oznSBp9TUc3k2KRZcKX51HX');
            // @ts-ignore
            const callTx = contract.inc().asTransaction({
                from: identity.address,
                chainIdHash: Buffer.from('test'),
            });

            callTx.sign = await signTransaction(callTx, identity.keyPair);
            callTx.hash = await hashTransaction(callTx);

            assert.equal(callTx.hash, 'nSgFf/3nCPmwyhQM8MzHrAEluskGDKIVGP0zlPHH5gA=');
        });

        it('should query a smart contract using Getter', async () => {
            // Setup address and ABI
            const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);

            // Query contract
            // @ts-ignore
            const result1 = await mey.queryContract(contract.query('key1'));
            assert.equal(result1, 11);

            // Call contract again
            // @ts-ignore
            const callTx = contract.inc().asTransaction({
                from: testAddress,
                chainIdHash: await mey.getChainIdHash()
            });
            const callTxHash = await mey.accounts.sendTransaction(callTx);
            const callTxReceipt = await longPolling(async () =>
                await mey.getTransactionReceipt(callTxHash)
            );
            assert.equal(callTxReceipt.status, 'SUCCESS');

            // Query contract
            // @ts-ignore
            const result2 = await mey.queryContract(contract.query('key1'));
            assert.equal(result2, 12);
        }).timeout(3000);

        it('should query a smart contract using state', async () => {
            // Setup address and ABI
            const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);
            // Query contract state by different types
            const variables = ['_sv_Value', Buffer.from('_sv_Value'), Array.from(Buffer.from('_sv_Value'))];
            for (const variable of variables) {
                // `as any` is needed b/c https://github.com/microsoft/TypeScript/issues/14107#issuecomment-483995795
                const result = await mey.queryContractState(contract.queryState(variable as any));
                assert.equal(result, 12, `state of ${variable} is wrong`);
            }
        });

        it('should query a smart contract using state and proof', async () => {
            // Setup address and ABI
            const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);
            // Query contract state by different types
            const variables = ['_sv_Value', Buffer.from('_sv_Value'), Array.from(Buffer.from('_sv_Value'))];
            // `as any` is needed b/c https://github.com/microsoft/TypeScript/issues/14107#issuecomment-483995795
            const result = await mey.queryContractStateProof(contract.queryState(variables as any[]));
            for (const proof of result.varProofs) {
                assert.equal(proof.value, 12, `state of ${proof.key} is wrong`);
                assert.equal(proof.inclusion, true, 'key inclusion should be true');
            }
            assert.equal(result.contractProof.inclusion, true, 'contract inclusion should be true');
            assert.deepEqual(result.contractProof.key, (new Address(contractAddress)).asBytes(), 'contract key should match decoded address');
        });

        it('should throw when quering non existing state', async () => {
            const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);
            await assert.isRejected(
                mey.queryContractState(contract.queryState('blahblah')),
                Error,
                `queried variable 0x${Buffer.from('blahblah').toString('hex')} does not exist in state at address ${contractAddress}`
            );

            const contract2 = Contract.fromAbi(contractAbi).setAddress('foo.bar');
            return assert.isRejected(
                mey.queryContractState(contract2.queryState('blahblah')),
                Error,
                'contract does not exist at address foo.bar'
            );
        });

        it('should get events from a deployed contract', async () => {
            const height = (await mey.blockchain()).bestHeight;
            const blockfrom = Math.max(1, height - 1000);
            const result = await mey.getEvents({
                address: contractAddress,
                blockfrom,
            });
            assert.equal(result[0].eventName, 'incremented');
            assert.equal(result[0].address.toString(), contractAddress.toString());
            assert.equal(result[0].args[1], 12);
            assert.equal(result[1].args[1], 11);
            assert.equal(result[0].args[0], 11);
            assert.equal(result[1].args[0], 10);

            // test getting the same event by two different arguments
            const result2 = await mey.getEvents({
                address: contractAddress,
                args: [10], // == new Map([[0, 10]])
                blockfrom,
            });
            assert.equal(result2.length, 1);
            assert.equal(result2[0].eventName, 'incremented');
            assert.equal(result2[0].address.toString(), contractAddress.toString());
            assert.equal(result2[0].args[0], 10);
            assert.equal(result2[0].args[1], 11);

            const result3 = await mey.getEvents({
                address: contractAddress,
                args: new Map([[1, 11]]),
                blockfrom,
            });
            assert.equal(result3.length, 1);
            assert.equal(result3[0].args[0], 10);
            assert.equal(result3[0].args[1], 11);
            assert.equal(result3[0].txhash, result2[0].txhash);
        });

        it('should stream events from a deployed contract', (done) => {
            let txhash: string;
            async function sendTx(): Promise<void> {
                const contract = Contract.fromAbi(contractAbi).setAddress(contractAddress);
                // @ts-ignore
                const callTx = contract.inc().asTransaction({
                    from: testAddress,
                    chainIdHash: await mey.getChainIdHash()
                });
                txhash = await mey.accounts.sendTransaction(callTx);
            }
            const stream = mey.getEventStream({
                address: contractAddress
            });
            stream.on('data', (event) => {
                assert.equal(event.eventName, 'incremented');
                assert.equal(event.txhash, txhash);
                stream.cancel();
                done();
            });
            sendTx();
        });
    });
});
