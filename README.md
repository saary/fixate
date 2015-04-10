# Fixated
Fixed width text stream for node.js

## What is it?
Easily create fixed width text stream/files with node.js

### Install
`npm install --save fixated`

## How?

```javascript
var Fixated = require('Fixated');

var format = {
  firstName: 15,
  lastName: 15,
  address: 200,
};

var fixated = new Fixated(format);
fixated.pipe(require('fs').createWriteStream('./out.txt');
fixated.write({firstName: 'charlie', lastName: 'doe', address: '1st some road, some where'});

fixated.end();

// out.txt should contain one line:
// charlie        doe            1st some road, some where
```

### License
MIT
