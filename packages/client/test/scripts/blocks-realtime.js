/*
Run this with
./node_modules/.bin/babel-node test/scripts/blocks-realtime.js
*/

import { MeyCoinClient } from '../../src/platforms/node';
//import { MeyCoinClient } from '../../src/platforms/web';


const mey = new MeyCoinClient();

mey.getBlockHeaderStream().on('data', (blockHeader) => {
    const obj = blockHeader.toObject();
    console.log(obj.blockno, obj.timestamp);
});