var Iconv  = require('iconv').Iconv;
var fs = require('fs');
var util = require('util');
var path = require('path');
var should = require('chai').should();

var Fixated  = require('../fixated.js');

describe('Test internation conversion format', function() {
  it('Should produce lines matching the conv fixture', function(done) {
    fs.readFile(path.join(__dirname, 'fixtures', 'iconv.txt'), 'utf8', function(err, data) {
      should.not.exist(err);
      should.exist(data);

      var lines = data.toString().split('\r\n').map(function(line) { return line + '\r\n'; });

      var format = {
        first:  5,
        second: 6,
        third: 2,
        forth: 8,
      };

      var iconv = new Iconv('UTF-8', 'CP1255');
      var opt = {
        convert: iconv.convert.bind(iconv),
      };

      var fixated = new Fixated(format, opt);

      fixated.on('data', function(line) {
        var oline = lines.shift();
        line.toString().should.equal(oline);
      });

      fixated.on('end', function(line) {
        done();
      });


      [1, 2, 3].forEach(function(num) {
        var item = {
          first: 'א',
          second: 'בבבבב' + num.toString(),
          third: util.format('%d%d%d', num, num, num),
          forth: 'גגגגדדדד',
        };

        fixated.write(item);
      });

      fixated.end();
    });
  });


});