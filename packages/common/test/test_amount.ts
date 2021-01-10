import chai from 'chai';
const assert = chai.assert;

import Amount from '../src/classes/amount';

describe('Amount', () => {
    it('should move decimal point', () => {
        assert.equal(Amount.moveDecimalPoint('1', 4), '10000');
        assert.equal(Amount.moveDecimalPoint('1', -4), '0.0001');
        assert.equal(Amount.moveDecimalPoint('0.0001', 4), '1');
        assert.equal(Amount.moveDecimalPoint('0.0001', -4), '0.00000001');
        assert.equal(Amount.moveDecimalPoint('10000', -4), '1');
        assert.equal(Amount.moveDecimalPoint('10000.1', 4), '100001000');
    });
    it('should parse amounts from number with default unit', () => {
        const a = new Amount(100);
        assert.equal(a.toString(), '100 mey');
        assert.equal(a.value.toString(), '100000000000000000000');
    });
    it('should be idempotent', () => {
        const a = new Amount(100);
        assert.equal(new Amount(a), a);
    });
    it('should throw with invalid argument', () => {
        class Invalid {
            toString(): string {
                return 'Foo';
            }
        }
        const invalidInput = new Invalid();
        assert.throws(() => {
            new Amount(invalidInput as any);
        }, 'Instantiate Amount with JSBI|number|string|Buffer|Uint8Array, not Foo (object)');
    });
    it('should parse amounts from string with unit', () => {
        const a = new Amount('100 gas');
        assert.equal(a.toString(), '100 gas');
        assert.equal(a.value.toString(), '100');

        const b = new Amount('100 mey');
        assert.equal(b.toString(), '100 mey');
        assert.equal(b.value.toString(), '100000000000000000000');
        assert.deepEqual(Array.from(b.asBytes()), [ 5, 107, 199, 94, 45, 99, 16, 0, 0 ]);

        const c = new Amount('10000 mgas');
        assert.equal(c.toString(), '10000 mgas');
        assert.equal(c.value.toString(), '10000000000000');
        assert.equal(c.toUnit('mey').toString(), '0.00001 mey');
    });
    it('should convert between units', () => {
        const a = new Amount('10000 mgas');
        assert.equal(a.toString(), '10000 mgas');
        assert.equal(a.toUnit('mey').toString(), '0.00001 mey');
        assert.equal(a.toUnit('mgas').toString(), '10000 mgas');
        assert.equal(a.toUnit('gas').toString(), '10000000000000 gas');
        assert.equal(a.formatNumber('mgas'), '10000');
    });
    it('should handle floating point numbers', () => {
        const a = new Amount('0.1 mey');
        assert.equal(a.toUnit('gas').toString(), '100000000000000000 gas');

        const b = new Amount(0.1);
        assert.equal(b.toUnit('gas').toString(), '100000000000000000 gas');

        assert.throws(() => new Amount(0.1, 'gas'), SyntaxError, 'Cannot convert 0.1 to a BigInt');
    });
    it('should parse amounts from buffers', () => {
        const a = new Amount(Buffer.from([ 5, 107, 199, 94, 45, 99, 16, 0, 0 ]));
        assert.equal(a.value.toString(), '100000000000000000000');
        assert.equal(a.toString(), '100000000000000000000 gas');
        assert.equal(a.toUnit('mey').toString(), '100 mey');
        const b = new Amount(Buffer.from([ 5, 107, 199, 94, 45, 99, 16, 0, 0 ]), 'mey');
        assert.equal(b.toString(), '100 mey');
    });
    it('should throw error for unrecognized unit', () => {
        assert.throws(() => new Amount('100 foo'), TypeError, 'unrecognized unit: foo');
    });
    it('should format 0 nicely', () => {
        const a = new Amount('0 gas');
        assert.equal(a.toString(), '0 gas');
        assert.equal(a.toUnit('mey').toString(), '0 mey');
        assert.equal(a.toUnit('mgas').toString(), '0 mgas');
        assert.equal(a.toUnit('gas').toString(), '0 gas');
    });
    it('toJSBI', () => {
        // Use default unit
        assert.equal(Amount.toJSBI(new Amount('10 gas')).toString(), '10');
        // Set explicit unit
        assert.equal(Amount.toJSBI('10 mey').toString(), '10000000000000000000');
        assert.equal(Amount.toJSBI('10', 'mey').toString(), '10000000000000000000');
    });
    it('compares amounts', () => {
        const a = new Amount('10 gas');
        // 10 gas == 10
        assert.equal(a.compare(10), 0);
        // 10 gas == 10 gas
        assert.equal(a.compare('10 gas'), 0);
        // 10 gas < 10 mey
        assert.equal(a.compare('10 mey'), -1);
        // 10 gas > 1
        assert.equal(a.compare(1), 1);
        // 10 gas < 1 mey (since b is unit-less, the other value will be parsed in the default unit)
        const b = new Amount('10 gas', '', '');
        assert.equal(b.compare(1), -1);
        // 10 gas > 1 gas (b is unit-less, but the other amount has an explicit unit)
        assert.equal(b.compare('1 gas'), 1);
    });
    it('adds amounts', () => {
        const a = new Amount('10 gas');
        // 10 gas + 10 = 20 gas
        assert.equal(a.add(10).toString(), '20 gas');
        // 10 gas + 10 mey = 10000000000000000010 gas
        assert.equal(a.add('10 mey').toString(), '10000000000000000010 gas');
        // 10 gas + 10 mey, as mey = 10.00000000000000001 mey
        assert.equal(a.add('10 mey').toUnit('mey').toString(), '10.00000000000000001 mey');

        const b = new Amount('10 mey');
        // 10 mey + 10 = 20 mey
        assert.equal(b.add(10).toString(), '20 mey');
        // 10 mey + 10 gas = 10.00000000000000001 mey
        assert.equal(b.add('10 gas').toString(), '10.00000000000000001 mey');
        // 10 mey + 10 gas, as gas = 10000000000000000010 gas
        assert.equal(b.add('10 gas').toUnit('gas').toString(), '10000000000000000010 gas');
    });
    it('substracts amounts', () => {
        const a = new Amount('10 mey');
        // 10 mey - 5 = 5 mey
        assert.equal(a.sub(5).toString(), '5 mey');
        // 10 mey - 100 gas = 9.9999999999999999 mey
        const b = a.sub('100 gas');
        assert.equal(b.toString(), '9.9999999999999999 mey');
        // 9.9999999999999999 mey + 100 gas = 10 mey
        assert.equal(b.add('100 gas').toString(), '10 mey');
        // 1 gas - 1 mey = -999999999999999999 gas
        assert.equal(new Amount('1 gas').sub('1 mey').toString(), '-999999999999999999 gas');
    });
    it('multiplies amounts', () => {
        const a = new Amount('10 mey');
        // 10 mey * 10 = 100 mey
        assert.equal(a.mul(10).toString(), '100 mey');
        // 10 mey * 10000, as gas = 100000 mey
        assert.equal(a.mul(10000).toUnit('gas').toString(), '100000000000000000000000 gas');
        // 10 mey * 10 mey, as mey = 100000000000000000000 mey
        assert.equal(a.mul('10 mey').toString(), '100000000000000000000 mey');
    });
    it('divides amounts', () => {
        const a = new Amount('10 mey');
        // 10 mey / 10 = 1 mey
        assert.equal(a.div(10).toString(), '1 mey');
        assert.equal(a.div(new Amount(10, 'gas', '')).toString(), '1 mey');
        // 10 mey / 20 = 0.5 mey
        assert.equal(a.div(20).toString(), '0.5 mey');
        // 10 mey / 5 mey = 2
        assert.equal(a.div('5 mey').toString(), '2');
        // 1 gas / 2 gas = 0
        assert.equal(new Amount('1 gas').div('2 gas').toString(), '0');
        // 100000000000 gas / 0.00000001 mey = 10
        assert.equal(new Amount('100000000000 gas').div('0.00000001 mey').toString(), '10');
    });
    it('should jsonify to a string with unit gas', () => {
        const amount = new Amount('1234 mey');
        const json = JSON.stringify({ amount });
        assert.equal(json, '{"amount":"1234000000000000000000 gas"}');
        // Parse it back to check it's the same value
        const amount2 = new Amount(JSON.parse(json).amount);
        assert.isTrue(amount.equal(amount2));
    });
});