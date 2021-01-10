/// <reference types="node" />
import JSBI from 'jsbi';
export declare type AmountArg = Amount | JSBI | number | string;
/**
 * A wrapper around amounts with units.
 * Over the network, amounts are sent as raw bytes.
 * In the client, they are exposed as BigInts, but also compatible with plain strings or numbers (if smaller than 2^31-1)
 * Uses 'mey' as default unit when passing strings or numbers.
 * Uses 'gas' as default unit when passing BigInts, buffers or byte arrays.
 * Whenever you pass amounts to other functions, they will try to coerce them to BigInt using this class.
 */
export default class Amount {
    value: Readonly<JSBI>;
    unit: string;
    private static _valueFromString;
    constructor(value: AmountArg | Buffer | Uint8Array, unit?: string, newUnit?: string);
    /**
     * Returns value as byte buffer
     */
    asBytes(): Buffer;
    /**
     * JSON.stringifes to string with unit gas, which can be easily deserialized by new Amount(x)
     */
    toJSON(): string;
    /**
     * Returns formatted string including unit
     */
    toString(): string;
    /**
     * Move decimal point in string by digits, positive to the right, negative to the left.
     * This extends the string if necessary.
     * Example: ("0.0001", 4 => "1"), ("0.0001", -4 => "0.00000001")
     * @param str
     * @param digits
     */
    static moveDecimalPoint(str: string, digits: number): string;
    formatNumber(unit?: string): string;
    /**
     * Convert to another unit
     * @param unit string (gas, mgas, mey)
     */
    toUnit(unit: string): Amount;
    /**
     * Convert arg into JSBI value
     * Can optionally provide a defaultUnit that is used if arg does not contain a unit.
     */
    static toJSBI(arg: AmountArg, defaultUnit?: string): JSBI;
    /**
     * Compare this amount with other amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * this >  other -> +1
     * this  < other -> -1
     * this == other -> 0
     * @param otherAmount
     */
    compare(otherAmount: AmountArg): number;
    /**
     * Return true if otherAmount is equal to this amount.
     * @param otherAmount
     */
    equal(otherAmount: AmountArg): boolean;
    /**
     * Add another amount to amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * 10 mey + 10 = 20 mey
     * 10 gas + 10 = 20 gas
     * 10 mey + 10 gas = 10.00000000000000001 mey
     * @param otherAmount
     */
    add(otherAmount: AmountArg): Amount;
    /**
     * Subtract another amount from amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * 10 mey - 5 = 5 mey
     * 10 gas - 5 = 5 gas
     * 1 gas - 1 mey = -999999999999999999 gas
     * @param otherAmount
     */
    sub(otherAmount: AmountArg): Amount;
    /**
     * Divide amount by another amount.
     * Warning: double check your units. The division is based on the gas value, so
     * if your otherAmount has a unit, it will be converted to gas.
     * This function tries to do the right thing in regards to dividing units:
     * 10 mey / 10 = 1 mey  (keep unit)
     * 10 mey / 10 mey = 1  (unit-less)
     * 1 gas / 2 gas = 0  (truncation of sub 1 gas amount)
     * @param otherAmount
     */
    div(otherAmount: AmountArg): Amount;
    /**
     * Multiply amount by another amount.
     * Warning: double check your units. The multiplication is based on the gas value, so
     * if your otherAmount has a unit, it will be converted to gas.
     * However, while the value is correct, there's no way to display unit^2.
     * 10 mey * 10 mey = 10 * 10^18 gas * 10 * 10^18 gas = 100 * 10^36 gas = 100 * 10^18 mey
     * 10 mey * 10 = 10 * 10^18 gas * 10 = 100 * 10^18 gas = 100 mey
     * @param otherAmount
     */
    mul(otherAmount: AmountArg): Amount;
}
