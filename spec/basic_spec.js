const request = require('request');

describe('hello world works', function () {
  let endpoint = 'http://localhost:3000/';

  it('GET returns "Hello World!"', function (done) {
    request.get(endpoint, function (error, response) {
      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual("Hello World!");
      done();
    });
  });
});