/**
 Object to store a repocitory of Gousto flagpoles
 */
"use strict";
var Flagpole = require('../src/flagpole');

var FlagpoleStore = {
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

FlagpoleStore.setupFlagpoles = function(_flagpoleJSONStr) {
  this.dataStore = {};
  this.dataList = [];
  var flagpolesObj = JSON.parse(_flagpoleJSONStr),
    flagpoleNames = Object.keys(flagpolesObj);
  for (var i = 0; i < flagpoleNames.length; i++) {
    var name = flagpoleNames[i],
      newFlagpole = new Flagpole(name, flagpolesObj[name], this.dataList.length);
    this.dataStore[name] = newFlagpole;
    this.dataList.push(newFlagpole);
  }
};

module.exports = FlagpoleStore;
