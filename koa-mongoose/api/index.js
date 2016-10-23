const Router = require('koa-router');
const users = require('./user');
const auth = require('./auth');

const apiRouter = new Router({
    prefix: '/api'
});

apiRouter.use(users.routes());
apiRouter.use(auth.routes());

module.exports = apiRouter;