var request = require('request');

describe('web server works....', function () {
  let endpoint = 'http://localhost:3000/';

  it('GET '/' returns 200 status code', function (done) {
    request.get(endpoint, function (error, response) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});

describe('Update flagpole....', function () {
  let endpoint = 'http://localhost:3000/update';

  it('Set unkown flagpole fails with 404', function (done) {
    request.put(endpoint, {json: true, body: {name:"UNKNOWN",value:"true"}}, function (error, response) {
      expect(response.statusCode).toEqual(404);
      done();
    });
  });

  it('Set ads flagpole with badly formed expression (no name) fails with 403', function (done) {
    request.put(endpoint, {json: true, body: {value:"true"}},function (error, response) {
      expect(response.statusCode).toEqual(403);
      done();
    });
  });

  it('Set ads flagpole with badly formed expression (no value) fails with 403', function (done) {
    request.put(endpoint, {json: true, body: {name:"ads"}},function (error, response) {
      expect(response.statusCode).toEqual(403);
      done();
    });
  });

  it('Set ads flagpole to false successfully', function (done) {
    request.put(endpoint, {json: true, body: {name:"ads", value:"false"}},function (error, response) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });
});

