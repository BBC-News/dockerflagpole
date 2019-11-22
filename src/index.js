const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');

try {
  const env = process.argv.length >= 3 ? process.argv[2] : 'live';
  const config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
  if (!config[env]) {
    throw new Error(`Config for environment "${env}" not available`)
  }
  const port = config[env].port || -1;
  if (port < 0 ) {
    throw new Error(`Environment "${env}" has an incorrectly configured port`)
  }

  const baseFlagpolesRouter = require('../routes/baseFlagpolesRouter');
  const setFlagpolesRouter = require('../routes/setFlagpolesRouter');

  const bodyParser = require("body-parser");
  const app = express();
  app.use('/static', express.static('public/static'));
  app.use('/src', express.static('public/src'));
  app.use('/assets', express.static('public/assets'));
  app.use(bodyParser.json());
  app.use(baseFlagpolesRouter.baseRouter);
  app.use(setFlagpolesRouter);

  baseFlagpolesRouter.setup(config, env);
  app.listen(port, function () {
    console.log(`Docker flagpoles app listening on port ${port} in ${env}`)
  })
} catch (e) {
  console.log(e);
}
