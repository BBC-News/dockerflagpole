var request = require('request');

describe('Get flagpole data ....', function () {
  let endpoint = 'http://localhost:3000/get';

  it("GET ('/get') returns 200 status code", function (done) {
    request.get(endpoint, function (error, response) {
      expect(response.statusCode).toEqual(200);
      done();
    });
  });

  it("GET ('/get') returns flagpole object data", function (done) {
    request.get(endpoint, function (error, response) {
      var data = response.json();
      expect(typeof data).toEqual('object');
      expect(data['ads']).toEqual(true);
      done();
    });
  });
});


