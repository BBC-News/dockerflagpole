/*
Simply return a list of flagpoles
 */
const express = require('express');
const router = express.Router();

router.get('/',  function(request, response) {
  var flagpoleStore = require('../src/dataStore'),
    routerUtils = require('../routes/routerUtils');

  var output = routerUtils.showAll(flagpoleStore.getAll());
  response.send(output);
});

module.exports = router;