var Transform = require('stream').Transform;
var util = require('util');

util.inherits(Fixated, Transform);

function Fixated(format, opt) {
  if (!(this instanceof Fixated)) {    
    return new Fixated(format, opt);
  }

  opt = opt || {};
  opt.writableObjectMode = true;
  opt.readableObjectMode = false;
  opt.fillChar = opt.fillChar || ' ';

  this._options = opt;

  Transform.call(this, opt);
  this._format = format;

  var lineSize = 0;
  Object.keys(this._format).forEach(function(key) {
    lineSize += format[key];
  });

  lineSize += 2; // \r\n 

  this._lineSize = lineSize;

}

Fixated.prototype._transform = function (data, encoding, callback) {
  var line = new Buffer(this._lineSize);

  // fill the buffer with spaces
  line.fill(this._options.fillChar);

  // place new line
  line.write('\r\n', this._lineSize - 2, 'ascii');

  var convert = this._options.convert;

  var offset = 0;
  var format = this._format;

  Object.keys(this._format).forEach(function(key) {
    if (data[key]) {
      var buffer = convert? convert(data[key]): data[key];

      if (Buffer.isBuffer(buffer)) {
        buffer.copy(line, offset, 0, format[key])
      }
      else {
        line.write(buffer.toString(), offset, format[key]);
      }
    }
    
    offset += format[key];
  });

  this.push(line);
  return callback();
};

module.exports = Fixated;

