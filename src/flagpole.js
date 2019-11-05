/**
 * Object to hold a flagpole
 */
"use strict";

let Flagpole = function(_name, _value, _index) {
  this.name = _name||'NONAME';
  this.setValue(_value);
  this.index = _index||0;
  this.value = false;
};

Flagpole.prototype.setFlagpole = function(_value) {
  this.setValue(_value);
};

Flagpole.prototype.setValue = function(_value) {
  this.value = !!(_value===true || _value==='true' || _value==='Y' || _value==='y' || _value===1)
};

Flagpole.prototype.textValue = function() {
  return this.value === true ? 'true' : 'false'
};

module.exports = Flagpole;