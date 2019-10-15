const express = require('express');
const router = express.Router();clearImmediate();

router.get('/update',  function(request, response) {
  var flagpoleStore = require('../src/dataStore'),
    routerUtils = require('../routes/routerUtils');
  let hasName = !!request.query.name,
    hasValue = !!request.query.value,
    flagpoleName = hasName ? request.query.name : null,
    flagpoleExists = hasName ? flagpoleStore.flagpoleExists(flagpoleName) : false,
    requestStatus = flagpoleExists ? hasValue ? 200 : 403 : (hasName && hasValue) ? 404 : 403,
    newValue = request.query.value,
    output = '';

  if (flagpoleExists) {
    flagpoleStore.setFlagpole(flagpoleName, newValue);
    output = routerUtils.showAll(flagpoleStore.getAll());
  } else {
    if (hasName && hasValue) {
      output = routerUtils.getErrorMsg('Requested flagpole "' + flagpoleName + '" does not exist');
    } else {
      output = routerUtils.getErrorMsg('Badly formed update expression');
    }
  }
  response.status(requestStatus).send(output);
});

module.exports = router;