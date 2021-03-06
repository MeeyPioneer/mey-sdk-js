'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var buffer = require('buffer');
var createHash = _interopDefault(require('create-hash'));
var JSBI = _interopDefault(require('jsbi'));

/**
 * This is a Typescript port of the base-x package
 */
function base(ALPHABET) {
  if (ALPHABET.length >= 255) throw new TypeError('Alphabet too long');
  var BASE_MAP = new Uint8Array(256);
  BASE_MAP.fill(255);

  for (var i = 0; i < ALPHABET.length; i++) {
    var x = ALPHABET.charAt(i);
    var xc = x.charCodeAt(0);
    if (BASE_MAP[xc] !== 255) throw new TypeError(x + ' is ambiguous');
    BASE_MAP[xc] = i;
  }

  var BASE = ALPHABET.length;
  var LEADER = ALPHABET.charAt(0);
  var FACTOR = Math.log(BASE) / Math.log(256); // log(BASE) / log(256), rounded up

  var iFACTOR = Math.log(256) / Math.log(BASE); // log(256) / log(BASE), rounded up

  function encode(source) {
    if (!buffer.Buffer.isBuffer(source)) throw new TypeError('Expected Buffer');
    if (source.length === 0) return ''; // Skip & count leading zeroes.

    var zeroes = 0;
    var length = 0;
    var pbegin = 0;
    var pend = source.length;

    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    } // Allocate enough space in big-endian base58 representation.


    var size = (pend - pbegin) * iFACTOR + 1 >>> 0;
    var b58 = new Uint8Array(size); // Process the bytes.

    while (pbegin !== pend) {
      var carry = source[pbegin]; // Apply "b58 = b58 * 256 + ch".

      var _i = 0;

      for (var _it = size - 1; (carry !== 0 || _i < length) && _it !== -1; _it--, _i++) {
        carry += 256 * b58[_it] >>> 0;
        b58[_it] = carry % BASE >>> 0;
        carry = carry / BASE >>> 0;
      }

      if (carry !== 0) throw new Error('Non-zero carry');
      length = _i;
      pbegin++;
    } // Skip leading zeroes in base58 result.


    var it = size - length;

    while (it !== size && b58[it] === 0) {
      it++;
    } // Translate the result into a string.


    var str = LEADER.repeat(zeroes);

    for (; it < size; ++it) {
      str += ALPHABET.charAt(b58[it]);
    }

    return str;
  }

  function decodeUnsafe(source) {
    if (typeof source !== 'string') throw new TypeError('Expected String');
    if (source.length === 0) return buffer.Buffer.alloc(0);
    var psz = 0; // Skip leading spaces.

    if (source[psz] === ' ') return; // Skip and count leading '1's.

    var zeroes = 0;
    var length = 0;

    while (source[psz] === LEADER) {
      zeroes++;
      psz++;
    } // Allocate enough space in big-endian base256 representation.


    var size = (source.length - psz) * FACTOR + 1 >>> 0; // log(58) / log(256), rounded up.

    var b256 = new Uint8Array(size); // Process the characters.

    while (source[psz]) {
      // Decode character
      var carry = BASE_MAP[source.charCodeAt(psz)]; // Invalid character

      if (carry === 255) return;
      var _i2 = 0;

      for (var _it2 = size - 1; (carry !== 0 || _i2 < length) && _it2 !== -1; _it2--, _i2++) {
        carry += BASE * b256[_it2] >>> 0;
        b256[_it2] = carry % 256 >>> 0;
        carry = carry / 256 >>> 0;
      }

      if (carry !== 0) throw new Error('Non-zero carry');
      length = _i2;
      psz++;
    } // Skip trailing spaces.


    if (source[psz] === ' ') return; // Skip leading zeroes in b256.

    var it = size - length;

    while (it !== size && b256[it] === 0) {
      it++;
    }

    var vch = buffer.Buffer.allocUnsafe(zeroes + (size - it));
    vch.fill(0x00, 0, zeroes);
    var j = zeroes;

    while (it !== size) {
      vch[j++] = b256[it++];
    }

    return vch;
  }

  function decode(source) {
    var buffer = decodeUnsafe(source);
    if (buffer) return buffer;
    throw new Error('Non-base' + BASE + ' character');
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  };
}

var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
var base58 = base(ALPHABET);

function encodeBuffer(val) {
  var enc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base58';

  if (enc === 'base58') {
    return base58.encode(buffer.Buffer.from(val));
  }

  return buffer.Buffer.from(val).toString(enc);
}
/**
 * If input is a string, use `enc` to decode string (default: base58).
 * Otherwise, just return Buffer.
 */

function decodeToBytes(val) {
  var enc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'base58';

  if (typeof val === 'string') {
    if (enc === 'base58') {
      return base58.decode(val);
    }

    return buffer.Buffer.from(val, enc);
  }

  return buffer.Buffer.from(val);
}

/**
 * @param bytes anything to a hex string that has an iterable that returns numbers and a reduce method, e.g. number[], Uint8Array, Buffer
 * @param format add the string '0x' in front of the output
 */
var toHexString = function toHexString(bytes) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var result = bytes.reduce(function (str, _byte) {
    return str + _byte.toString(16).padStart(2, '0');
  }, '');
  if (!format) return result;
  if (result === '00' || result === '') return '0x0';
  return '0x' + result;
};
var fromHexString = function fromHexString(hexString) {
  if (hexString.length === 0) return Uint8Array.from([]);
  if (hexString.length % 2 === 1) hexString = '0' + hexString;
  var match = hexString.match(/.{1,2}/g);
  if (!match) throw new Error('cannot parse string as hex');
  return new Uint8Array(match.map(function (_byte2) {
    return parseInt(_byte2, 16);
  }));
};
/**
 * Convert number to Uint8Array
 * @param d 
 * @param length 
 */

var fromNumber = function fromNumber(d) {
  var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;

  if (d >= Math.pow(2, length * 8)) {
    throw new Error('Number exeeds range');
  }

  var arr = new Uint8Array(length);

  for (var i = 0, j = 1; i < 8; i++, j *= 0x100) {
    arr[i] = d / j & 0xff;
  }

  return arr;
};
/**
 * TODO: what's this? Is this useful?
 */

var toBytesUint32 = function toBytesUint32(num) {
  var arr = new ArrayBuffer(8);
  var view = new DataView(arr);
  view.setUint32(0, num, true);
  return arr;
};

/**
 * This is a Typescript port of the bs58check package
 */

function bs58checkBase(checksumFn) {
  // Encode a buffer as a base58-check encoded string
  function encode(payload) {
    var checksum = checksumFn(payload);
    return base58.encode(buffer.Buffer.concat([payload, checksum], payload.length + 4));
  }

  function decodeRaw(buffer) {
    var payload = buffer.slice(0, -4);
    var checksum = buffer.slice(-4);
    var newChecksum = checksumFn(payload);
    if (checksum[0] ^ newChecksum[0] | checksum[1] ^ newChecksum[1] | checksum[2] ^ newChecksum[2] | checksum[3] ^ newChecksum[3]) return;
    return payload;
  } // Decode a base58-check encoded string to a buffer, no result if checksum is wrong


  function decodeUnsafe(string) {
    var buffer = base58.decodeUnsafe(string);
    if (!buffer) return;
    return decodeRaw(buffer);
  }

  function decode(string) {
    var buffer = base58.decode(string);
    var payload = decodeRaw(buffer);
    if (!payload) throw new Error('Invalid checksum');
    return payload;
  }

  return {
    encode: encode,
    decode: decode,
    decodeUnsafe: decodeUnsafe
  };
} // SHA256(SHA256(buffer))


function sha256x2(buffer) {
  var tmp = createHash('sha256').update(buffer).digest();
  return createHash('sha256').update(tmp).digest();
}

var bs58check = bs58checkBase(sha256x2);

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

/**
 * Returns the next interval to use for exponential backoff.
 * This curve yields every value 4 times before doubling in the next step.
 * The function is :code:`multiplier * 2**Math.floor(n/4)`.
 * By default (multiplier = 1s), the intervals reach ca. 1 minute (total time elapsed ca. 4 minutes) after step 24,
 * so it is advised to declare a timeout after a certain number of steps.
 * @param n step on the interval curve
 * @param multiplier multiplier, default 1000 (1s)
 */
function backoffIntervalStep(n) {
  var multiplier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
  return multiplier * Math.pow(2, Math.floor(n / 4));
}
/**
 * A promisified version of setTimeout
 * @param ms 
 */

function waitFor(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
/**
 * Retry calling an async function until it does not throw a matching error.
 * If it throws a non-matching error, re-raise that, otherwise return the result.
 * @param fn async function that returns a result.
 * @param matchError error match function. Will retry as long as this function returns true.
 * @param timeout timeout in ms, will re-raise last error when next try would exceed this time. 0 (default) means no timeout is applied.
 * @param baseBackoffInterval basis used for exponential backoff intervall calculation
 */

function retryIfErrorMatch(fn, matchError) {
  var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  var baseBackoffInterval = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 500;
  var started = new Date();
  var retryCount = 0;

  var retryLoad = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator(function* () {
      try {
        return yield fn();
      } catch (e) {
        if (matchError(e) === false) {
          throw e;
        }

        var interval = backoffIntervalStep(retryCount++, baseBackoffInterval);

        if (timeout) {
          var elapsed = +new Date() - +started;

          if (elapsed + interval >= timeout) {
            var unit = elapsed < 1000 ? 'ms' : 's';
            var elapsedFormat = elapsed < 1000 ? elapsed : Math.round(elapsed / 100) / 10;
            throw new Error("timeout after ".concat(elapsedFormat).concat(unit, ": ").concat(e));
          }
        }

        yield waitFor(interval);
        return yield retryLoad();
      }
    });

    return function retryLoad() {
      return _ref.apply(this, arguments);
    };
  }();

  return retryLoad();
}

var ADDRESS_PREFIXES = {
  ACCOUNT: 0x42,
  CONTRACT: 0xC0,
  PRIVATE_KEY: 0xAA
};
var ACCOUNT_NAME_LENGTH = 12;
var SYSTEM_ADDRESSES = ['mey.system', 'mey.name', 'mey.enterprise', 'mey.vault'];
var UNITS = {
  NATIVE_TOKEN: {
    baseLabel: 'MeyCoin',
    baseDigits: 18,
    subUnits: [{
      e: 0,
      label: 'gas'
    }, {
      e: 18,
      label: 'mey'
    }],
    unitSize: {
      'mey': 18,
      'mgas': 9,
      'gas': 0
    }
  }
};
var BIP44_ID = 441;
var WALLET_HDPATH = "m/44'/".concat(BIP44_ID, "'/0'/0/");
var constants = {
  ADDRESS_PREFIXES: ADDRESS_PREFIXES,
  UNITS: UNITS,
  ACCOUNT_NAME_LENGTH: ACCOUNT_NAME_LENGTH,
  BIP44_ID: BIP44_ID,
  WALLET_HDPATH: WALLET_HDPATH,
  SYSTEM_ADDRESSES: SYSTEM_ADDRESSES
};

var DEFAULT_USER_UNIT = 'mey';
var DEFAULT_NETWORK_UNIT = 'gas';

function getUnitPrecision(unit) {
  var units = UNITS.NATIVE_TOKEN.unitSize;

  function isValidUnit(unit) {
    return unit in units;
  }

  if (!isValidUnit(unit)) {
    throw new TypeError("unrecognized unit: ".concat(unit));
  }

  return units[unit];
}
/**
 * A wrapper around amounts with units.
 * Over the network, amounts are sent as raw bytes.
 * In the client, they are exposed as BigInts, but also compatible with plain strings or numbers (if smaller than 2^31-1)
 * Uses 'mey' as default unit when passing strings or numbers.
 * Uses 'gas' as default unit when passing BigInts, buffers or byte arrays.
 * Whenever you pass amounts to other functions, they will try to coerce them to BigInt using this class.
 */


var Amount = /*#__PURE__*/function () {
  _createClass(Amount, null, [{
    key: "_valueFromString",
    // value in base unit
    // unit for displaying
    value: function _valueFromString(value) {
      var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (unit === '') {
        unit = DEFAULT_USER_UNIT;
      }

      var prec = getUnitPrecision(unit);

      if (prec > 0) {
        value = Amount.moveDecimalPoint(value, prec);
      }

      return JSBI.BigInt(value);
    }
  }]);

  function Amount(value) {
    var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var newUnit = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, Amount);

    _defineProperty(this, "value", void 0);

    _defineProperty(this, "unit", void 0);

    if (value instanceof Amount || value.value) {
      return value;
    }

    if (typeof value === 'string') {
      var _value$split = value.split(' ', 2),
          _value$split2 = _slicedToArray(_value$split, 2),
          amount = _value$split2[0],
          _unit = _value$split2[1];

      unit = unit || _unit;
      this.value = Amount._valueFromString(amount, unit);
    } else if (typeof value === 'number') {
      this.value = Amount._valueFromString('' + value, unit);
    } else if (value instanceof JSBI) {
      if (typeof unit === 'undefined' || unit === '') {
        unit = DEFAULT_NETWORK_UNIT;
      }

      this.value = JSBI.BigInt(value);
    } else if (value instanceof buffer.Buffer || value instanceof Uint8Array) {
      if (typeof unit === 'undefined' || unit === '') {
        unit = DEFAULT_NETWORK_UNIT;
      }

      this.value = JSBI.BigInt(toHexString(value, true));
    } else {
      throw new Error("Instantiate Amount with JSBI|number|string|Buffer|Uint8Array, not ".concat(value, " (").concat(_typeof(value), ")"));
    }

    this.unit = unit;

    if (typeof this.unit === 'undefined' || this.unit === '') {
      this.unit = DEFAULT_USER_UNIT;
    } // Set new unit for displaying


    if (typeof newUnit !== 'undefined') {
      this.unit = newUnit;
    } // Freeze value. Otherwise some libraries mess this up since it is actually an Array subclass with a custom propery


    this.value = Object.freeze(this.value);
  }
  /**
   * Returns value as byte buffer
   */


  _createClass(Amount, [{
    key: "asBytes",
    value: function asBytes() {
      return buffer.Buffer.from(fromHexString(this.value.toString(16)));
    }
    /**
     * JSON.stringifes to string with unit gas, which can be easily deserialized by new Amount(x)
     */

  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toUnit('gas').toString();
    }
    /**
     * Returns formatted string including unit
     */

  }, {
    key: "toString",
    value: function toString() {
      if (this.unit) {
        return "".concat(this.formatNumber(), " ").concat(this.unit);
      }

      return "".concat(this.formatNumber());
    }
    /**
     * Move decimal point in string by digits, positive to the right, negative to the left.
     * This extends the string if necessary.
     * Example: ("0.0001", 4 => "1"), ("0.0001", -4 => "0.00000001")
     * @param str 
     * @param digits 
     */

  }, {
    key: "formatNumber",
    value: function formatNumber() {
      var unit = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      if (unit === '') unit = this.unit;
      if (unit === '') return this.value.toString();
      var prec = getUnitPrecision(unit);
      return Amount.moveDecimalPoint(this.value.toString(), -prec);
    }
    /**
     * Convert to another unit
     * @param unit string (gas, mgas, mey)
     */

  }, {
    key: "toUnit",
    value: function toUnit(unit) {
      return new Amount(this.value, '', unit);
    }
    /**
     * Convert arg into JSBI value
     * Can optionally provide a defaultUnit that is used if arg does not contain a unit.
     */

  }, {
    key: "compare",

    /**
     * Compare this amount with other amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * this >  other -> +1
     * this  < other -> -1
     * this == other -> 0
     * @param otherAmount 
     */
    value: function compare(otherAmount) {
      var a = this.value;
      var b = Amount.toJSBI(otherAmount, this.unit);
      return JSBI.equal(a, b) ? 0 : JSBI.lessThan(a, b) ? -1 : 1;
    }
    /**
     * Return true if otherAmount is equal to this amount.
     * @param otherAmount 
     */

  }, {
    key: "equal",
    value: function equal(otherAmount) {
      return this.compare(otherAmount) === 0;
    }
    /**
     * Add another amount to amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * 10 mey + 10 = 20 mey
     * 10 gas + 10 = 20 gas
     * 10 mey + 10 gas = 10.00000000000000001 mey
     * @param otherAmount 
     */

  }, {
    key: "add",
    value: function add(otherAmount) {
      var sum = JSBI.add(this.value, Amount.toJSBI(otherAmount, this.unit));
      return new Amount(sum, this.unit);
    }
    /**
     * Subtract another amount from amount.
     * If otherAmount has no unit, assumes unit of this amount.
     * 10 mey - 5 = 5 mey
     * 10 gas - 5 = 5 gas
     * 1 gas - 1 mey = -999999999999999999 gas
     * @param otherAmount 
     */

  }, {
    key: "sub",
    value: function sub(otherAmount) {
      var sum = JSBI.subtract(this.value, Amount.toJSBI(otherAmount, this.unit));
      return new Amount(sum, this.unit);
    }
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

  }, {
    key: "div",
    value: function div(otherAmount) {
      var newUnit;
      var sum = JSBI.divide(this.value, Amount.toJSBI(otherAmount, 'gas')); // if both amounts had units, the result should be unit-less

      var otherHasUnit = otherAmount instanceof Amount && Boolean(otherAmount.unit);

      if (!otherHasUnit && typeof otherAmount === 'string') {
        var _$split = "".concat(otherAmount).split(' ', 2),
            _$split2 = _slicedToArray(_$split, 2),
            _unit = _$split2[1];

        otherHasUnit = Boolean(_unit);
      }

      if (otherHasUnit) {
        newUnit = '';
      }

      return new Amount(sum, this.unit, newUnit);
    }
    /**
     * Multiply amount by another amount.
     * Warning: double check your units. The multiplication is based on the gas value, so
     * if your otherAmount has a unit, it will be converted to gas.
     * However, while the value is correct, there's no way to display unit^2.
     * 10 mey * 10 mey = 10 * 10^18 gas * 10 * 10^18 gas = 100 * 10^36 gas = 100 * 10^18 mey
     * 10 mey * 10 = 10 * 10^18 gas * 10 = 100 * 10^18 gas = 100 mey
     * @param otherAmount 
     */

  }, {
    key: "mul",
    value: function mul(otherAmount) {
      var sum = JSBI.multiply(this.value, Amount.toJSBI(otherAmount, 'gas'));
      return new Amount(sum, this.unit);
    }
  }], [{
    key: "moveDecimalPoint",
    value: function moveDecimalPoint(str, digits) {
      if (digits === 0 || str === '0') return str;

      if (str.indexOf('.') === -1) {
        str = str + '.';
      }

      var idx = str.indexOf('.'); // Extend string to have enough space to move decimal point

      if (digits > str.length - idx) {
        str = str.padEnd(digits + idx + 1, '0');
      }

      if (digits < -idx) {
        str = str.padStart(str.length - idx - digits, '0');
      } // remove decimal point and reinsert at new location


      idx = str.indexOf('.');
      str = str.replace('.', '');
      str = str.substr(0, idx + digits) + '.' + str.substr(idx + digits); // remove trailing 0 and .

      str = str.replace(/\.?0*$/, ''); // remove leading 0

      str = str.replace(/^0+/, ''); // add leading 0 before .

      str = str.replace(/^\./, '0.');
      return str;
    }
  }, {
    key: "toJSBI",
    value: function toJSBI(arg) {
      var defaultUnit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

      if (!(arg instanceof Amount)) {
        var _$split3 = "".concat(arg).split(' ', 2),
            _$split4 = _slicedToArray(_$split3, 2),
            amount = _$split4[0],
            _unit = _$split4[1];

        var unit = _unit || defaultUnit;
        arg = new Amount(amount, unit);
      }

      return JSBI.BigInt(arg.value);
    }
  }]);

  return Amount;
}();

var systemAddresses = _toConsumableArray(SYSTEM_ADDRESSES);

/**
 * A wrapper around addresses. Internally addresses are stored and sent as raw bytes,
 * but client-side they are displayed as base58-check encoded strings.
 * The encoding requires some computation, so you should only convert address objects to strings when needed.
 */
var Address = /*#__PURE__*/function () {
  function Address(address) {
    _classCallCheck(this, Address);

    _defineProperty(this, "value", void 0);

    _defineProperty(this, "encoded", void 0);

    _defineProperty(this, "isName", void 0);

    this.isName = false;

    if (address instanceof Address) {
      // Just copy buffer
      this.value = buffer.Buffer.from(address.value);
    } else if (typeof address === 'string') {
      // Parse string
      if (address.length <= ACCOUNT_NAME_LENGTH || Address.isSystemName(address)) {
        this.value = buffer.Buffer.from(address);
        this.isName = true;
      } else {
        try {
          this.value = Address.decode(address);
        } catch (e) {
          throw new Error("Address \"".concat(address, "\" could not be parsed as a base58-check encoded string and is not a valid name. ").concat(e));
        }
      }

      this.encoded = address;
    } else if (address instanceof buffer.Buffer) {
      this.value = address;
    } else if (address instanceof Uint8Array) {
      // Treat array-like as buffer
      this.value = buffer.Buffer.from(address);
    } else if (address.encoded) {
      this.isName = address.isName;
      this.encoded = address.encoded;
      this.value = buffer.Buffer.from(address.value);
    } else {
      throw new Error("Instantiate Address with raw bytes, a string in base58-check encoding, or a valid name, not ".concat(address));
    } // Check for name encoded as bytes


    if (!this.isName) {
      var arrValue = Array.from(this.value); // Remove trailing 0s

      while (arrValue[arrValue.length - 1] === 0) {
        arrValue.pop();
      }

      var buf = buffer.Buffer.from(arrValue);

      if (buf.length <= ACCOUNT_NAME_LENGTH || Address.isSystemName(buf.toString())) {
        this.isName = true;
        this.value = buf;
      }
    }
  }

  _createClass(Address, [{
    key: "asBytes",
    value: function asBytes() {
      return new Uint8Array(this.value);
    }
  }, {
    key: "toJSON",
    value: function toJSON() {
      return this.toString();
    }
  }, {
    key: "toString",
    value: function toString() {
      if (typeof this.encoded !== 'undefined' && this.encoded !== null) {
        return this.encoded;
      }

      if (this.isName) {
        this.encoded = buffer.Buffer.from(this.value).toString();
      } else {
        this.encoded = Address.encode(this.value);
      }

      return this.encoded;
    }
    /**
     * Decode bs58check string into bytes
     */

  }, {
    key: "equal",
    value: function equal(_otherAddress) {
      var otherAddress = _otherAddress instanceof Address ? _otherAddress : new Address(_otherAddress);
      return Address.valueEqual(this.value, otherAddress.value);
    }
    /**
     * Returns true if the address is empty, i.e. '' or empty buffer
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.value.length === 0;
    }
  }, {
    key: "isSystemAddress",
    value: function isSystemAddress() {
      return this.isName && Address.isSystemName(this.toString());
    }
  }, {
    key: "bytes",
    get: function get() {
      return this.asBytes();
    }
  }, {
    key: "length",
    get: function get() {
      return this.value.length;
    }
  }], [{
    key: "decode",
    value: function decode(bs58string) {
      var decoded = bs58check.decode(bs58string);
      if (decoded[0] !== ADDRESS_PREFIXES.ACCOUNT) throw new Error("invalid address prefix (".concat(decoded[0], ")"));
      if (decoded.length !== 33 + 1) throw new Error("invalid address length (".concat(decoded.length - 1, ")"));
      return buffer.Buffer.from(decoded.slice(1));
    }
    /**
     * Encode bytes into bs58check string
     */

  }, {
    key: "encode",
    value: function encode(byteArray) {
      if (!byteArray || byteArray.length === 0) return ''; // return empty string for null address

      var buf = buffer.Buffer.from([ADDRESS_PREFIXES.ACCOUNT].concat(_toConsumableArray(byteArray)));
      return bs58check.encode(buf);
    }
  }, {
    key: "isSystemName",
    value: function isSystemName(name) {
      return systemAddresses.indexOf(name) !== -1;
    }
  }, {
    key: "setSystemAddresses",
    value: function setSystemAddresses(addresses) {
      systemAddresses = addresses;
    }
  }, {
    key: "valueEqual",
    value: function valueEqual(a, b) {
      return a.length == b.length && a.every(function (aElem, i) {
        return aElem === b[i];
      });
    }
  }]);

  return Address;
}();

/**
 * This interface defines a type for user provided tx data.
 * Internal functions can use different types but this is the publicly facing API.
 */

(function (TxTypes) {
  TxTypes[TxTypes["Normal"] = 0] = "Normal";
  TxTypes[TxTypes["Governance"] = 1] = "Governance";
  TxTypes[TxTypes["Redeploy"] = 2] = "Redeploy";
  TxTypes[TxTypes["FeeDelegation"] = 3] = "FeeDelegation";
  TxTypes[TxTypes["Transfer"] = 4] = "Transfer";
  TxTypes[TxTypes["Call"] = 5] = "Call";
  TxTypes[TxTypes["Deploy"] = 6] = "Deploy";
})(exports.TxTypes || (exports.TxTypes = {}));

exports.Address = Address;
exports.Amount = Amount;
exports.backoffIntervalStep = backoffIntervalStep;
exports.base58 = base58;
exports.base58check = bs58check;
exports.constants = constants;
exports.decodeToBytes = decodeToBytes;
exports.encodeBuffer = encodeBuffer;
exports.fromHexString = fromHexString;
exports.fromNumber = fromNumber;
exports.retryIfErrorMatch = retryIfErrorMatch;
exports.toBytesUint32 = toBytesUint32;
exports.toHexString = toHexString;
exports.waitFor = waitFor;
