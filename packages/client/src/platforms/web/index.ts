import 'regenerator-runtime/runtime';

import MeyCoinClient from '../../client';
import GrpcWebProvider from '../../providers/grpc-web';
import { Amount, Address, constants } from '@mey-sdk-js/common';
import Contract from '../../models/contract';
import Tx from '../../models/tx';

MeyCoinClient.platform = 'web';
MeyCoinClient.defaultProviderClass = GrpcWebProvider;

export {
    MeyCoinClient,
    GrpcWebProvider,
    constants,
    Contract,
    Address,
    Amount,
    Tx,
    MeyCoinClient as default
};