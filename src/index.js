const express = require('express');
var getFlagpolesRouter = require('../routes/getFlagpolesRouter');
var setFlagpolesRouter = require('../routes/setFlagpolesRouter');

const app = express();
const port = 3000;

var flagpoleStore = require('../src/dataStore');

flagpoleStore.setupFlagpoles('{"ads" : true, "analytics" : true,"sherlock" : false}');

app.use(getFlagpolesRouter);
app.use(setFlagpolesRouter);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
