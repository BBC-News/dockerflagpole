const express = require('express');
const yaml = require('js-yaml');
const fs = require('fs');

try {
  const env = process.argv.length >= 3 ? process.argv[2] : 'none';
  const config = yaml.safeLoad(fs.readFileSync('config.yaml', 'utf8'));
  if (!config[env]) {
    throw new Error(`Config for environment "${env}" not available`)
  }
  const port = config[env].port || -1;
  const flagpoleDataURL = config[env].source || '';
  const usesS3DataSource = config[env].uses_s3 || false;
  const s3Bucket = config[env].s3_bucket || '';
  const awsRegion = config[env].aws_region || '';

  if (port < 0 || flagpoleDataURL === '') {
    throw new Error(`Environment "${env}" incorrectly configured...check port and source`)
  }
  if (usesS3DataSource === true && s3Bucket === '') {
    throw new Error(`Environment "${env}" incorrectly configured for AWS S3 - check source and s3_bucket`)
  }
  const baseFlagpolesRouter = require('../routes/baseFlagpolesRouter');
  const getFlagpolesRouter = require('../routes/getFlagpolesRouter');
  const setFlagpolesRouter = require('../routes/setFlagpolesRouter');
  const writeFlagpolesRouter = require('../routes/writeFlagpolesRouter');
  const bodyParser = require("body-parser");
  const app = express();
  app.use('/static', express.static('public/static'));
  app.use('/src', express.static('public/src'));
  app.use('/assets', express.static('public/assets'));
  app.use(bodyParser.json());
  app.use(baseFlagpolesRouter);
  app.use(getFlagpolesRouter);
  app.use(setFlagpolesRouter);
  app.use(writeFlagpolesRouter);

  const flagpoleStore = require('../src/dataStore');
  flagpoleStore.setupFlagpoles(flagpoleDataURL, usesS3DataSource, s3Bucket).then(function () {
    app.listen(port, function () {
      console.log(`Docker flagpoles app listening on port ${port} in ${env}`)
    })
  });
} catch (e) {
  console.log(e);
}
