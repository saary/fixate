'use strict';
var Transform = require('stream').Transform;
var util = require('util');

var rowDelimiters = {'unix': '\n', 'mac': '\r', 'windows': '\r\n'};

util.inherits(Fixated, Transform);

function Fixated(format, opt) {
  if (!(this instanceof Fixated)) {    
    return new Fixated(format, opt);
  }

  opt = opt || {};
  opt.writableObjectMode = true;
  opt.readableObjectMode = false;
  opt.fillChar = opt.fillChar || ' ';
  this._rowDelimiter  = (rowDelimiters[opt.rowDelimiter] ? rowDelimiters[opt.rowDelimiter] : rowDelimiters.windows);

  this._options = opt;

  Transform.call(this, opt);
  this._format = format;

  var lineSize = 0;
  this._format.forEach(function(item) {
    lineSize += item[1];
  });

  lineSize += this._rowDelimiter.length;

  this._lineSize = lineSize;

}

Fixated.prototype._transform = function (data, encoding, callback) {
  var line = new Buffer(this._lineSize);

  // fill the buffer with spaces
  line.fill(this._options.fillChar);

  // place new line
  line.write(this._rowDelimiter, this._lineSize - this._rowDelimiter.length, 'ascii');

  var convert = this._options.convert;

  var offset = 0;
  var format = this._format;
  var rightAlignment = this._options.rightAlignment;

  this._format.forEach(function(item) {
    var key = item[0];
    var keyLength = item[1];
    if (data[key]) {
      var buffer = convert? convert(data[key]): data[key];
      var alignment = 0;
      var byteLength = rightAlignment && Buffer.byteLength(buffer);

      if (rightAlignment && byteLength < format[key]) {
        alignment += keyLength - byteLength;
      }

      if (Buffer.isBuffer(buffer)) {
        buffer.copy(line, offset + alignment, 0, keyLength);
      }
      else {
        line.write(buffer.toString(), offset + alignment, keyLength);
      }
    }
    
    offset += keyLength;
  });
  
  this.push(line);
  return callback();
};

module.exports = Fixated;
