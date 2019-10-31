/*
Simply return a list of flagpoles
 */
const express = require('express');
const baseRouter = express.Router();

baseRouter.get('/',  function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

module.exports = baseRouter;