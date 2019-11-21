/*
Simply return a list of flagpoles
 */
const express = require('express');
const baseRouter = express.Router();
const flagpoleStore = require('../src/dataStore');

let flagpoleDataSources = {},
  defaultFlagpoleSource = '',
  usesS3DataSource =  false,
  s3Bucket = '';

const setup = function(_config, _env){
  flagpoleDataSources = _config[_env].sources || '';
  usesS3DataSource = _config[_env].usesS3 || false;
  s3Bucket = _config[_env].s3Bucket || '';
  defaultFlagpoleSource = _config[_env].defaultSource

  if (flagpoleDataSources === '') {
    throw new Error(`Environment "${_env}" has incorrectly configured sources!!`)
  }
  if (usesS3DataSource === true && s3Bucket === '') {
    throw new Error(`Environment "${env}" incorrectly configured for AWS S3 - check source and s3_bucket`)
  }
}

const setupFlagpoleSource = function(_arg) {
  let routeArg = _arg || '',
    flagpoleDataURL = routeArg

  if (routeArg === '') {
    flagpoleDataURL = flagpoleDataSources[defaultFlagpoleSource] || ''
  } else {
    if (flagpoleDataSources[routeArg]) {
      flagpoleDataURL = flagpoleDataSources[routeArg]
    } else {
      let sourceREResult = /^([^.]+)(.json|)$/.exec(routeArg)
      if (sourceREResult && sourceREResult[1]) {
        flagpoleDataURL = sourceREResult[1] + '.json'
      }
    }
  }
  return flagpoleDataURL
}

const setupFlagpoleData = function(_arg) {
  return new Promise(function (resolve, reject) {
    let routeArg = _arg || '',
      flagpoleDataURL = setupFlagpoleSource(_arg);

    if (flagpoleDataURL === '') {
      reject(`Cannot find flagpole source from ${routeArg}`)
    } else {
      flagpoleStore.setupFlagpoles(flagpoleDataURL, usesS3DataSource, s3Bucket).then(function () {
        resolve()
      }).catch(function (_err) {
        reject(_err)
      })
    }
  })
}

baseRouter.get('/',  function(request, response) {
  setupFlagpoleData('').then(function () {
    response.sendFile(__dirname + '/index.html');
  }).catch(function (_err) {
    response.status(403).send("Error processing flagpoles data :: " + _err);
  })
});

baseRouter.get('/get',  function(request, response) {
  response.send(JSON.stringify(flagpoleStore.getAll()));
});

baseRouter.get('/:source',  function(request, response) {
    setupFlagpoleData(request.params.source).then(function () {
      response.sendFile(__dirname + '/index.html');
    }).catch(function (_err) {
      response.status(404).send("Error processing flagpoles file :" + request.params.source + " :: " + _err);
    })
});

module.exports.baseRouter = baseRouter;
module.exports.setup = setup;