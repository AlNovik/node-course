const Router = require('koa-router');
const users = require('./user');

const apiRouter = new Router();

apiRouter.use(users.routes());

module.exports = apiRouter;