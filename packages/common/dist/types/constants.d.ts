export declare const ADDRESS_PREFIXES: {
    ACCOUNT: number;
    CONTRACT: number;
    PRIVATE_KEY: number;
};
export declare const ACCOUNT_NAME_LENGTH = 12;
export declare const SYSTEM_ADDRESSES: string[];
export declare const UNITS: {
    NATIVE_TOKEN: {
        baseLabel: string;
        baseDigits: number;
        subUnits: {
            e: number;
            label: string;
        }[];
        unitSize: {
            'mey': number;
            'mgas': number;
            'gas': number;
        };
    };
};
export declare const BIP44_ID = 441;
export declare const WALLET_HDPATH: string;
declare const _default: {
    ADDRESS_PREFIXES: {
        ACCOUNT: number;
        CONTRACT: number;
        PRIVATE_KEY: number;
    };
    UNITS: {
        NATIVE_TOKEN: {
            baseLabel: string;
            baseDigits: number;
            subUnits: {
                e: number;
                label: string;
            }[];
            unitSize: {
                'mey': number;
                'mgas': number;
                'gas': number;
            };
        };
    };
    ACCOUNT_NAME_LENGTH: number;
    BIP44_ID: number;
    WALLET_HDPATH: string;
    SYSTEM_ADDRESSES: string[];
};
export default _default;
