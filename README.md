# lamport

Lamport One Time Signatures.

[Lamport Signatures](http://en.wikipedia.org/wiki/Lamport_signature) are a simple but strong
cryptographic signatures system that uses symmetric cryptography, and is believed
to still be secure under quantum computers. Unfortunately, you can only use a key one time.
(this can be extended using Merkle Trees, however that is not implemented here)

``` js
var lamport = require('lamport')()
var keys = lamport.generate()
var signature = lamport.sign(keys.private, 'MESSAGE TO SIGN')
if(lamport.verify(keys.public, 'MESSAGE TO SIGN', signature))
  console.log('Authentic.')
else
  console.log('Not Authentic!')

```

## License

MIT
