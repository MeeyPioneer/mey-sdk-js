export const ADDRESS_PREFIXES = {
    ACCOUNT: 0x42,
    CONTRACT: 0xC0,
    PRIVATE_KEY: 0xAA,
};

export const ACCOUNT_NAME_LENGTH = 12;

export const SYSTEM_ADDRESSES = ['mey.system', 'mey.name', 'mey.enterprise', 'mey.vault'];

export const UNITS = {
    NATIVE_TOKEN: {
        baseLabel: 'MeyCoin',
        baseDigits: 18,

        subUnits: [
            { e: 0, label: 'gas' },
            { e: 18, label: 'mey' }
        ],

        unitSize: {
            'mey': 18,
            'mgas': 9,
            'gas': 0
        }
    }
};

export const BIP44_ID = 441;

export const WALLET_HDPATH = `m/44'/${BIP44_ID}'/0'/0/`;

export default {
    ADDRESS_PREFIXES,
    UNITS,
    ACCOUNT_NAME_LENGTH,
    BIP44_ID,
    WALLET_HDPATH,
    SYSTEM_ADDRESSES,
};