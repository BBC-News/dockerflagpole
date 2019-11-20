/**
 Object to store a repository of flagpoles
 */
"use strict";

let FlagpoleStore = {
  dataStore:{}
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
  const fs = require('fs');
  let flagpoleData = fs.readFileSync(this.dataSourceURL, 'utf8');
  if (!flagpoleData) {
    throw new Error("Unable to read flagpole data from source '" + this.dataSourceURL + "'")
  }
  this.dataStore = JSON.parse(flagpoleData)
}

FlagpoleStore.setFlagpole = function(_flagpoleName, _newValue) {
  let newValue = _newValue===true || _newValue==='true' || _newValue==='TRUE' ||
    _newValue==='Y' || _newValue==='y' || _newValue===1 || false,
    flagpole = this.dataStore[_flagpoleName]||null;
  if (flagpole !== null){
    flagpole.value = newValue;
    const dateFormat = require('dateformat');
    let now = new Date();
    flagpole.modified = dateFormat(now, "ddd, dd mmm yyyy HH:MM:ss");
  }
}

FlagpoleStore.setupFlagpoles = function(_flagpoleDataURL) {
  this.dataStore = {};
  this.dataSourceURL = _flagpoleDataURL;
  this.readFlagpoles()
};

FlagpoleStore.writeFlagpoles = function(_flagpolesFile) {
  const fs = require('fs');
  let res = true, outputStr = '';

  try {
    outputStr = JSON.stringify(this.dataStore);
    fs.writeFileSync(this.dataSourceURL, outputStr, 'utf8')
  } catch (e) {
    console.log("Caught Error on write :"+e.message);
    res = false
  }
  return res
}


module.exports = FlagpoleStore;
