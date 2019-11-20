/*
Simply return a list of flagpoles
 */
const express = require('express');
const baseRouter = express.Router();
const flagpoleStore = require('../src/dataStore');

let flagpoleDataURL = '';
let usesS3DataSource =  false;
let s3Bucket = '';

const setup = function(_config, _env){
  flagpoleDataURL = _config[_env].source || '';
  usesS3DataSource = _config[_env].uses_s3 || false;
  s3Bucket = _config[_env].s3_bucket || '';

  if (flagpoleDataURL === '') {
    throw new Error(`Environment "${_env}" incorrectly configured source!!`)
  }
  if (usesS3DataSource === true && s3Bucket === '') {
    throw new Error(`Environment "${env}" incorrectly configured for AWS S3 - check source and s3_bucket`)
  }
}

baseRouter.get('/',  function(request, response) {
  flagpoleStore.setupFlagpoles(flagpoleDataURL, usesS3DataSource, s3Bucket).then(function () {
    response.sendFile(__dirname + '/index.html');
  })
});

baseRouter.get('/get',  function(request, response) {
  response.send(JSON.stringify(flagpoleStore.getAll()));
});

baseRouter.get('/:source',  function(request, response) {
  try {
    flagpoleStore.setupFlagpoles(request.params.source, usesS3DataSource, s3Bucket).then(function () {
      response.sendFile(__dirname + '/index.html');
    }).catch(function (_err) {
      response.status(404).send("Error Reading flagpoles file:" + request.params.source + " :: " + _err);
    })
  } catch (_err){
    throw new Error("Error getting flagpole data :"+_err)
  }
});

module.exports.baseRouter = baseRouter;
module.exports.setup = setup;