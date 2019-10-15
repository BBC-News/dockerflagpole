const request = require('request');

describe('web server works....', function () {
  let endpoint = 'http://localhost:3000/';

  it('GET returns 200 status code', function (done) {
    request.get(endpoint, function (error, response) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});

describe('Update flagpole....', function () {
  let endpoint = 'http://localhost:3000/update';

  it('Set unkown flagpole fails', function (done) {
    request.get(endpoint+'?name=none&value=false', function (error, response) {
      expect(response.statusCode).toEqual(404);
      done();
    });
  });

  it('Set ads flagpole with badly formed expression fails', function (done) {
    request.get(endpoint+'?name=ads', function (error, response) {
      expect(response.statusCode).toEqual(403);
      done();
    });
  });

  it('Set ads flagpole to false successfully', function (done) {
    request.get(endpoint+'?name=ads&value=false', function (error, response) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});