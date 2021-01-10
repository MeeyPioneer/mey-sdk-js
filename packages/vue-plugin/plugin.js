import { Wallet } from '@mey-sdk-js/wallet';
import { GrpcWebProvider } from '@mey-sdk-js/client';

export default {
    install (Vue, options) {
        const wallet = new Wallet();
        for (const chain of options.chains || []) {
            wallet.useChain({
                chainId: chain.chainId,
                provider: new GrpcWebProvider({ url: chain.nodeUrl })
            });
        }
        Vue.prototype.$mey = wallet;
    }
};