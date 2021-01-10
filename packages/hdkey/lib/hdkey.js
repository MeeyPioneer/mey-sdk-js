var assert = require('assert')
var Buffer = require('safe-buffer').Buffer
var createHmac = require('create-hmac')
var randomBytes = require('randombytes')
var secp256k1 = require('secp256k1')

var MASTER_SECRET = Buffer.from('Bitcoin seed', 'utf8')
var HARDENED_OFFSET = 0x80000000

// Bitcoin hardcoded by default, can use package `coininfo` for others
var BITCOIN_VERSIONS = {private: 0x0488ADE4, public: 0x0488B21E}

function HDKey (versions) {
  this.versions = versions || BITCOIN_VERSIONS
  this.depth = 0
  this.index = 0
  this._privateKey = null
  this._publicKey = null
  this.chainCode = null
}

Object.defineProperty(HDKey.prototype, 'pubKeyHash', { get: function () { return this.identifier } })

Object.defineProperty(HDKey.prototype, 'privateKey', {
  get: function () {
    return this._privateKey
  },
  set: function (value) {
    assert.equal(value.length, 32, 'Private key must be 32 bytes.')
    assert(secp256k1.privateKeyVerify(value) === true, 'Invalid private key')

    this._privateKey = value
    this._publicKey = secp256k1.publicKeyCreate(value, true)
  }
})

Object.defineProperty(HDKey.prototype, 'publicKey', {
  get: function () {
    return this._publicKey
  },
  set: function (value) {
    assert(value.length === 33 || value.length === 65, 'Public key must be 33 or 65 bytes.')
    assert(secp256k1.publicKeyVerify(value) === true, 'Invalid public key')

    this._publicKey = secp256k1.publicKeyConvert(value, true) // force compressed point
    this._privateKey = null
  }
})

HDKey.prototype.derive = function (path) {
  if (path === 'm' || path === 'M' || path === "m'" || path === "M'") {
    return this
  }

  var entries = path.split('/')
  var hdkey = this
  entries.forEach(function (c, i) {
    if (i === 0) {
      assert(/^[mM]{1}/.test(c), 'Path must start with "m" or "M"')
      return
    }

    var hardened = (c.length > 1) && (c[c.length - 1] === "'")
    var childIndex = parseInt(c, 10) // & (HARDENED_OFFSET - 1)
    assert(childIndex < HARDENED_OFFSET, 'Invalid index')
    if (hardened) childIndex += HARDENED_OFFSET

    hdkey = hdkey.deriveChild(childIndex)
  })

  return hdkey
}

HDKey.prototype.deriveChild = function (index) {
  var isHardened = index >= HARDENED_OFFSET
  var indexBuffer = Buffer.allocUnsafe(4)
  indexBuffer.writeUInt32BE(index, 0)

  var data

  if (isHardened) { // Hardened child
    assert(this.privateKey, 'Could not derive hardened child key')

    var pk = this.privateKey
    var zb = Buffer.alloc(1, 0)
    pk = Buffer.concat([zb, pk])

    // data = 0x00 || ser256(kpar) || ser32(index)
    data = Buffer.concat([pk, indexBuffer])
  } else { // Normal child
    // data = serP(point(kpar)) || ser32(index)
    //      = serP(Kpar) || ser32(index)
    data = Buffer.concat([this.publicKey, indexBuffer])
  }

  var I = createHmac('sha512', this.chainCode).update(data).digest()
  var IL = I.slice(0, 32)
  var IR = I.slice(32)

  var hd = new HDKey(this.versions)

  // Private parent key -> private child key
  if (this.privateKey) {
    // ki = parse256(IL) + kpar (mod n)
    try {
      hd.privateKey = secp256k1.privateKeyTweakAdd(this.privateKey, IL)
      // throw if IL >= n || (privateKey + IL) === 0
    } catch (err) {
      // In case parse256(IL) >= n or ki == 0, one should proceed with the next value for i
      return this.derive(index + 1)
    }
  // Public parent key -> public child key
  } else {
    // Ki = point(parse256(IL)) + Kpar
    //    = G*IL + Kpar
    try {
      hd.publicKey = secp256k1.publicKeyTweakAdd(this.publicKey, IL, true)
      // throw if IL >= n || (g**IL + publicKey) is infinity
    } catch (err) {
      // In case parse256(IL) >= n or Ki is the point at infinity, one should proceed with the next value for i
      return this.derive(index + 1, isHardened)
    }
  }

  hd.chainCode = IR
  hd.depth = this.depth + 1
  hd.index = index

  return hd
}

HDKey.prototype.sign = function (hash) {
  return secp256k1.sign(hash, this.privateKey).signature
}

HDKey.prototype.verify = function (hash, signature) {
  return secp256k1.verify(hash, signature, this.publicKey)
}

HDKey.prototype.wipePrivateData = function () {
  if (this._privateKey) randomBytes(this._privateKey.length).copy(this._privateKey)
  this._privateKey = null
  return this
}

HDKey.prototype.toJSON = function () {
  return {
    xpriv: this.privateExtendedKey,
    xpub: this.publicExtendedKey
  }
}

HDKey.fromMasterSeed = function (seedBuffer, versions) {
  var I = createHmac('sha512', MASTER_SECRET).update(seedBuffer).digest()
  var IL = I.slice(0, 32)
  var IR = I.slice(32)

  var hdkey = new HDKey(versions)
  hdkey.chainCode = IR
  hdkey.privateKey = IL

  return hdkey
}

HDKey.HARDENED_OFFSET = HARDENED_OFFSET
module.exports = HDKey
