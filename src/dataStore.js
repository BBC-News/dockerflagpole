/**
 Object to store a repository of flagpoles
 */
"use strict";
var Flagpole = require('../src/flagpole');

var FlagpoleStore = {
  config:{},
  dataStore:{},
  dataList:[]
};

FlagpoleStore.getAll = function() {
  return this.dataList
};

FlagpoleStore.getFlagpole = function(_flagpoleName) {
  return this.dataStore[_flagpoleName];
};

FlagpoleStore.flagpoleExists = function(_flagpoleName) {
  return this.dataStore[_flagpoleName] !== undefined;
};

FlagpoleStore.setFlagpole = function(_flagpoleName, _newValue) {
  let flagpole = this.dataStore[_flagpoleName]||null;
  if (flagpole){
    flagpole.setFlagpole(_newValue);
  }
};

FlagpoleStore.readFlagpoles = function(){
  const fs = require('fs');
  var flagpoleData = fs.readFileSync(this.dataSourceURL, 'utf8');
  if (!flagpoleData){
    throw new Error("Unable to read flagpole data from source '"+this.dataSourceURL+"'")
  }
  var flagpolesObj = JSON.parse(flagpoleData),
    flagpoleNames = Object.keys(flagpolesObj);
  for (var i = 0; i < flagpoleNames.length; i++) {
    var name = flagpoleNames[i],
      newFlagpole = new Flagpole(name, flagpolesObj[name], this.dataList.length);
    newFlagpole.setValue(flagpolesObj[name] === true)
    this.dataStore[name] = newFlagpole;
    this.dataList.push(newFlagpole);
  }
}

FlagpoleStore.setupFlagpoles = function(_flagpoleDataURL) {
  this.dataStore = {};
  this.dataList = [];
  this.dataSourceURL = _flagpoleDataURL;
  this.readFlagpoles()
};

FlagpoleStore.writeFlagpoles = function(_flagpolesFile) {
  const fs = require('fs');
  var flagpoleData = {}, res = true, outputStr = '';

  try {
    for (var i = 0; i < this.dataList.length; i++) {
      var flagpole = this.dataList[i];
      flagpoleData[flagpole.name] = flagpole.value
    }
    outputStr = JSON.stringify(flagpoleData);
    fs.writeFileSync(this.dataSourceURL, outputStr, 'utf8')
  } catch (e) {
    console.log("Caught Error on write :"+e.message);
    res = false
  }
  return res
}


module.exports = FlagpoleStore;
