var fs = require('fs');
var path = require('path');
var should = require('chai').should();

var Fixated  = require('../fixated.js');

describe('Test basic format', function() {
  it('Should produce lines matching the basic fixture', function(done) {
    fs.readFile(path.join(__dirname, 'fixtures', 'basic.txt'), function(err, data) {
      should.not.exist(err);
      should.exist(data);

      var lines = data.toString().split('\r\n').map(function(line) { return line + '\r\n'; });

      var format = {
        first:  5,
        second: 2,
        third: 10,
      };

      var fixated = new Fixated(format);
      fixated.on('data', function(line) {
        var oline = lines.shift();
        line.toString().should.equal(oline);
      });

      [1, 2, 3, 4, 5, 6, 7, 8].forEach(function(num) {
        var item = {
          first: num.toString(),
          second: num.toString(),
          third: num.toString(),
        };

        fixated.write(item);
      });

      done();
    });
  });


});