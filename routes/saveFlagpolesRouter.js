/*
This will maintain an endpoint that writes out a JSON file holding the flagpoles
 */
const express = require('express');
const saveRouter = express.Router();

saveRouter.post('/save',  function(request, response) {
  const flagpoleStore = require('../src/dataStore');

  flagpoleStore.saveData()
});

module.exports = saveRouter;