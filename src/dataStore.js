/**
 Object to store a repository of flagpoles
 */
"use strict";
const AWS = require('aws-sdk');
const fs = require('fs');

let FlagpoleStore = {
  dataStore : {},
  usesS3Data : false
};

FlagpoleStore.getAll = function() {
  return this.dataStore
};

FlagpoleStore.getFlagpole = function(_flagpoleName) {
  return this.dataStore[_flagpoleName];
};

FlagpoleStore.flagpoleExists = function(_flagpoleName) {
  return this.dataStore[_flagpoleName] !== undefined;
};

FlagpoleStore.readFlagpoles = function() {
    let flagpoleData = fs.readFileSync(this.dataSourceURL, 'utf8');
    if (!flagpoleData) {
      throw new Error("Unable to read flagpole data from source '" + this.dataSourceURL + "'")
    }
    return flagpoleData
}

FlagpoleStore.readS3Flagpoles = function() {
  return new Promise(function(resolve, reject) {
    let params = {
      Bucket: this.s3Bucket,
      Key: this.dataSourceURL
    };
    new AWS.S3({apiVersion: '2006-03-01'}).getObject(params, function (_err, _data) {
      if (_err) {
        reject(_err)
      } else {
        resolve(_data.Body.toString());
      }
    })
  }.bind(this))
}

FlagpoleStore.setFlagpole = function(_flagpoleName, _newValue) {
  let newValue = _newValue === true || _newValue === 'true' || _newValue === 'TRUE' ||
    _newValue === 'Y' || _newValue === 'y' || _newValue === 1 || false,
    res = true;

  return new Promise(function (resolve, reject) {
    let clonedData = JSON.parse(JSON.stringify(this.dataStore));
    let flagpole = clonedData[_flagpoleName];
    flagpole.value = newValue;
    const dateFormat = require('dateformat');
    let now = new Date();
    flagpole.modified = dateFormat(now, "ddd, dd mmm yyyy HH:MM:ss");

    this.writeFlagpoles(JSON.stringify(clonedData)).then(function () {
      this.dataStore = clonedData;
      resolve()
    }.bind(this), function (_err) {
      reject(_err)
    })
  }.bind(this))
}

FlagpoleStore.setupFlagpoles = function(_flagpoleDataURL, _usesS3DataSource, _s3Bucket) {
  this.dataSourceURL = _flagpoleDataURL;
  this.usesS3Data = _usesS3DataSource===true;
  this.s3Bucket = _s3Bucket || '';

  return new Promise(function(resolve, reject) {
    if (this.usesS3Data) {
      this.readS3Flagpoles().then(function (_flagpoleData) {
        this.dataStore = JSON.parse(_flagpoleData);
        resolve()
      }.bind(this), function (_err) {
        throw new Error(`Reading from s3 failed (${_err})`)
      }.bind(this))
    } else {
      this.dataStore = JSON.parse(this.readFlagpoles());
      resolve()
    }
  }.bind(this))
}


FlagpoleStore.writeFlagpoles = function(_outputStr) {
  return new Promise(function(resolve, reject) {
    if (this.usesS3Data) {
      let params = {
        Bucket: this.s3Bucket,
        Key: this.dataSourceURL,
        Body: Buffer.from(_outputStr, 'utf8')
      };
      let writeResponse = new AWS.S3({apiVersion: '2006-03-01'}).putObject(params, function (_err, _data) {
        if (_err) {
          reject(`Error writing to file :${this.dataSourceURL} in S3 bucket : ${this.s3Bucket}`)
        } else {
          resolve()
        }
      }.bind(this))
    } else {
      fs.writeFileSync(this.dataSourceURL, _outputStr, 'utf8')
    }
  }.bind(this))
}


module.exports = FlagpoleStore;
