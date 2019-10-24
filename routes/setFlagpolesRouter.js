const express = require('express');
const router = express.Router();clearImmediate();

router.put('/update',  function(request, response) {
  var flagpoleStore = require('../src/dataStore'),
    routerUtils = require('../routes/routerUtils');
  let flagpoleName = request.body.name,
    newValue = request.body.value,
    hasName = flagpoleName !== undefined,
    hasValue = newValue !== undefined,
    flagpoleExists = flagpoleStore.flagpoleExists(flagpoleName) === true,
    requestStatus = flagpoleExists ? hasValue ? 200 : 403 : (hasName && hasValue) ? 404 : 403,
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