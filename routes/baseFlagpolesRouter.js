/*
This will create the initial page
 */
const express = require('express');
const baseRouter = express.baseRouter();

baseRouter.get('/',  function(request, response) {
  var flagpoleStore = require('../src/dataStore'),
    baseRouterUtils = require('../routes/routerUtils');

  var output = baseRouterUtils.showAll(flagpoleStore.getAll());
  response.send(output);
});

module.exports = baseRouter;