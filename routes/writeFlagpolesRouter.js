const express = require('express');
const router = express.Router();

router.put('/write',  function(request, response) {
  let flagpoleStore = require('../src/dataStore'),
    requestStatus = 200;

  if (!flagpoleStore.writeFlagpoles()){
    requestStatus = 500
  }

  response.status(requestStatus).send();
});

module.exports = router;