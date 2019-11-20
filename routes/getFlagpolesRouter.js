/*
This will return all flagpoles
 */
const express = require('express');
const getRouter = express.Router();

getRouter.get('/get',  function(request, response) {
  let flagpoleStore = require('../src/dataStore');
  response.send(JSON.stringify(flagpoleStore.getAll()));
});

module.exports = getRouter;