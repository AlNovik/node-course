const koa = require('koa');
const app = koa();
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');

const errorHandler = require('./middlewares/error-handler');

const api = require('./api');

app.use(logger());
app.use(bodyParser());

app.use(errorHandler);
app.use(api.routes());

module.exports = app;