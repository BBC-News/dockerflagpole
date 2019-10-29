/*
This will create the initial page
 */
const express = require('express');
const baseRouter = express.Router();

baseRouter.get('/get',  function(request, response) {
  let flagpoleStore = require('../src/dataStore');
  response.send(JSON.stringify(flagpoleStore.getAll()));
});

module.exports = baseRouter;