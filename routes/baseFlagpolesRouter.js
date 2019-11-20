/*
Simply return a list of flagpoles
 */
const express = require('express');
const baseRouter = express.Router();

const setConfig = function(){
  console.log("Hello World")
}

baseRouter.get('/',  function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

baseRouter.get('/*',  function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

module.exports.baseRouter = baseRouter;
module.exports.setConfig = setConfig;