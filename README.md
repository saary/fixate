# Fixate
Fixed width text stream for node.js

## What is it?
Easily create fixed width text stream/files with node.js

## How?

```javascript
var Fixate = require('Fixate');

var format = {
  firstName: 15,
  lastName: 15,
  address: 200,
};

var fixate = new Fixate(format);
fixate.pipe(require('fs').createWriteStream('./out.txt');
fixate.write({firstName: 'charlie', lastName: 'doe', address: '1st some road, some where'});

fixate.end();

// out.txt should contain one line:
// charlie        doe            1st some road, some where
```

### License
MIT
