
var crypto = require('crypto')
var assert = require('assert')

function eachBit(message, iter) {
  for(var i = 0; i < message.length; i++) {
    for(var j = 0; j < 8; j++)
      iter(message[i] & 0x80>>j ? 1 : 0, i*8+j)
  }
}

module.exports = function () {
  var cell = 32
  var number = 512
  var size = cell*number
  var alg = 'sha256'

  function hash (value) {
    return crypto.createHash(alg).update(value).digest()
  }

  return {
    generate: function () {
      var PRIVATE = crypto.randomBytes(size)
      var PUBLIC = new Buffer(size)
      for(var i = 0; i < size; i += cell) {
        hash(PRIVATE.slice(i, i+cell))
          .copy(PUBLIC, i, 0, cell)
      }
      return {
        private: PRIVATE, public: PUBLIC
      }
    },
    sign: function (PRIVATE, message) {
      if(message.length > cell)
        throw new Error('message is incorrect length, please hash it with:'+alg)
      if(PRIVATE.USED)
        throw new Error('this private key was already used on:'+PRIVATE.USED)
      var m = hash(message)
      var sig = []
      eachBit(m, function (bit, i) {
        sig.push(PRIVATE.slice(cell*(i*2 + bit), cell*(i*2 + bit + 1)))
      })
      PRIVATE.USED = new Date()
      return Buffer.concat(sig)
    },
    verify: function (PUBLIC, message, SIGNATURE) {
      if(message.length > cell)
        throw new Error('message is incorrect length, please hash it with:'+alg)
      var sig = []
      var m = hash(message)
      try {
        eachBit(m, function (bit, i) {
          assert.deepEqual(
            hash(SIGNATURE.slice(i*cell, (i+1)*cell)),
            PUBLIC.slice(cell*(i*2 + bit), cell*(i*2 + 1+bit)),
            'not authentic'
          )
        })
      } catch (err) {
        if(/not authentic/.test(err.message)) return false
        throw err
      }
      return true
    }
  }
}


if(!module.parent) {

  var assert = require('assert')
  var expected = [
    1,1,1,1,1,1,1,1,
    0,0,0,0,0,0,0,0,
    1,0,1,0,1,0,1,0,
    1,1,1,1,0,0,0,0,
    1,1,1,1,0,0,0,1
  ]

  var bits = []
  eachBit(new Buffer('ff00aaf0f1', 'hex'), function (bit, index) {
    bits.push(bit)
  })

  console.log(JSON.stringify(bits))
  assert.deepEqual(bits, expected)
}

