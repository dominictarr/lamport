var assert = require('assert')
var lamport = require('../')()

var message = 'hello!'

var keys = lamport.generate()
var sig = lamport.sign(keys.private, message)

var valid = lamport.verify(keys.public, message, sig)
assert.equal(valid, true, 'expected: authentic')

var invalid = lamport.verify(keys.public, message+'ish', sig)
assert.equal(invalid, false, 'expected: not authentic')

assert.throws(function () {
  var sig = lamport.sign(keys.private, 'do not use a one-time signature twice')
})
