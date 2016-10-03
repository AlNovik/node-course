// 1. unit
// 2. интеграционное
// 3. e2e

const server = require('../server');
const request = require('request');

describe("server", function() {

  before(function() {
    server.listen(3000);
  });

  after(function() {
    server.close();
  });

  it("works", function(done) {
    request({
      method: 'GET',
      url: 'http://localhost:3000'
    }, function(err, response, body) {
      response.headers['content-type'].should.eql('text/html');
      done();
    });
  });

});
