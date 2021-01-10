import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
const assert = chai.assert;

import MeyCoinClient from '../src';
import GrpcWebNodeProvider from '../src/providers/grpc-web-node';

describe('MeyCoin over grpc-web', () => {
    const provider = new GrpcWebNodeProvider({ url: 'http://165.22.49.15:7845' });
    const mey = new MeyCoinClient({}, provider);

    describe('getChainInfo()', () => {
        it('should return basic chain information', async () => {
            const info = await mey.getChainInfo();
            assert.equal(info.chainid.magic, 'dev.chain');
        });
    });
});
