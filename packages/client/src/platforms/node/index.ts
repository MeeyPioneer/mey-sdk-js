import 'regenerator-runtime/runtime';

import MeyCoinClient from '../../client';
import GrpcProvider from '../../providers/grpc';
import GrpcWebProvider from '../../providers/grpc-web';
import { Amount, Address, constants } from '@mey-sdk-js/common';
import Contract from '../../models/contract';
import Tx from '../../models/tx';

MeyCoinClient.platform = 'node';
MeyCoinClient.defaultProviderClass = GrpcProvider;

export {
    MeyCoinClient,
    GrpcProvider,
    GrpcWebProvider,
    constants,
    Contract,
    Address,
    Amount,
    Tx,
    MeyCoinClient as default
};
