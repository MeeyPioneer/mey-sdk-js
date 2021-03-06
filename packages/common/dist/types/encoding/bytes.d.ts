/// <reference types="node" />
export declare type StringOrBuffer = string | Buffer | Uint8Array;
export declare type ByteEncoding = 'base58' | BufferEncoding;
export declare function encodeBuffer(val: Buffer | Uint8Array, enc?: ByteEncoding): string;
/**
 * If input is a string, use `enc` to decode string (default: base58).
 * Otherwise, just return Buffer.
 */
export declare function decodeToBytes(val: StringOrBuffer, enc?: ByteEncoding): Buffer;
interface NumberIterable<T> {
    [Symbol.iterator](): Iterator<T>;
}
interface HexConvertible {
    reduce: <U, T = this>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: NumberIterable<T>) => U, initialValue: U) => U;
}
/**
 * @param bytes anything to a hex string that has an iterable that returns numbers and a reduce method, e.g. number[], Uint8Array, Buffer
 * @param format add the string '0x' in front of the output
 */
export declare const toHexString: (bytes: HexConvertible, format?: boolean) => string;
export declare const fromHexString: (hexString: string) => Uint8Array;
/**
 * Convert number to Uint8Array
 * @param d
 * @param length
 */
export declare const fromNumber: (d: number, length?: number) => Uint8Array;
/**
 * TODO: what's this? Is this useful?
 */
export declare const toBytesUint32: (num: number) => ArrayBuffer;
export {};
