const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');

try {
  const env = process.argv.length >= 3 ? process.argv[2] : 'live';
  const config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
  const port = config[env]?config[env].port || 3000 : 3000;

  const getFlagpolesRouter = require('../routes/getFlagpolesRouter');
  const setFlagpolesRouter = require('../routes/setFlagpolesRouter');

  const flagpoleStore = require('../src/dataStore');
  flagpoleStore.setupFlagpoles('{"ads" : true, "analytics" : true,"sherlock" : false}');

  const app = express();
  //app.use(express.static('public'));
  app.use(getFlagpolesRouter);
  app.use(setFlagpolesRouter);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
} catch (e) {
  console.log(e);
}
