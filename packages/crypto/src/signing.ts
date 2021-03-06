import { ec } from 'elliptic';
import { hashTransaction } from './hashing';
import { Buffer } from 'buffer';
import { encodeBuffer, decodeToBytes, ByteEncoding } from '@mey-sdk-js/common';

/**
 * Returns signature encoded in DER format in base64.
 * @param sig 
 */
export function encodeSignature(sig: ec.Signature, enc: ByteEncoding = 'base64'): string {
    return encodeBuffer(Buffer.from(sig.toDER()), enc);
}

/**
 * Sign transaction with key.
 * @param {Buffer} msgHash hash of a message. Can technically be any Buffer,
 *                         but it really is only secure if using a hash.
 * @param {BN} key key pair or private key
 */
export async function signMessage(msgHash: Buffer, key: ec.KeyPair, enc: ByteEncoding = 'base64'): Promise<string> {
    const sig = key.sign(msgHash);
    return encodeSignature(sig, enc);
}

/**
 * Sign transaction with key.
 * @param {object} tx transaction
 * @param {BN} key key pair or private key
 */
export async function signTransaction(tx: any, key: ec.KeyPair, enc: ByteEncoding = 'base64'): Promise<string> {
    const msgHash = await hashTransaction(tx, 'bytes', false) as Buffer;
    return signMessage(msgHash, key, enc);
}

/**
 * Verify that a signature for msg was generated by key
 * @param key key pair or public key
 */
export async function verifySignature(msg: Buffer, key: ec.KeyPair, signature: string, enc: ByteEncoding = 'base64'): Promise<boolean> {
    try {
        const sign = decodeToBytes(signature, enc);
        // @ts-ignore: the typedef is wrong, a Buffer is an allowed input here
        return key.verify(msg, sign);
    } catch (e) {
        throw Error('could not decode signature: ' + e);
    }
}

/**
 * Verify that a signature for tx was generated by key
 */
export async function verifyTxSignature(tx: any, key: ec.KeyPair, signature: string, enc: ByteEncoding = 'base64'): Promise<boolean> {
    const msg = await hashTransaction(tx, 'bytes', false) as Buffer;
    return await verifySignature(msg, key, signature, enc);
}

