import { MeyCoinRPCServiceClient } from '../../types/rpc_grpc_web_pb';
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport';

interface GrpcWebProviderConfig {
    url?: string;
}

/**
 * Provider for GRPC-WEB connections over HTTP.
 * This is compatible with Node.js environments.
 * Streaming methods are not supported.
 * This is mostly for testing, for productiomn use use GrpcWebProvider or GrpcProvider.
 */
class GrpcWebNodeProvider {
    client: any;
    config: GrpcWebProviderConfig;

    /**
     * .. code-block:: javascript
     * 
     *     import { GrpcWebNodeProvider } from '@mey-sdk-js/client';
     *     const provider = new GrpcWebProvider({url: 'http://localhost:7845'});
     * 
     * @param {GrpcWebProviderConfig} config
     */
    constructor(config: GrpcWebProviderConfig = {}) {
        this.config = {
            ...this.defaultConfig,
            ...config
        };
        const options = {
            transport: NodeHttpTransport()
        };
        this.client = new MeyCoinRPCServiceClient(this.config.url, options);
    }

    get defaultConfig(): GrpcWebProviderConfig {
        return {
            url: 'http://localhost:7845'
        };
    }
}

export default GrpcWebNodeProvider;
