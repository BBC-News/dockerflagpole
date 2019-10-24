const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');

try {
  const env = process.argv.length >= 3 ? process.argv[2] : 'live';
  const config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
  const port = config[env]?config[env].port || 3000 : 3000;

  const baseFlagpolesRouter = require('../routes/baseFlagpolesRouter');
  const getFlagpolesRouter = require('../routes/getFlagpolesRouter');
  const setFlagpolesRouter = require('../routes/setFlagpolesRouter');
  const bodyParser = require("body-parser");

  const flagpoleStore = require('../src/dataStore');
  flagpoleStore.setupFlagpoles('{"ads" : true, "analytics" : true,"sherlock" : false}');

  const app = express();
  app.use('/static', express.static('public/static'));
  app.use('/src', express.static('public/src'));
  app.use('/assets', express.static('public/assets'));
  //app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(baseFlagpolesRouter);
  app.use(getFlagpolesRouter);
  app.use(setFlagpolesRouter);

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
} catch (e) {
  console.log(e);
}
