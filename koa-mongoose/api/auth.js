const Router = require('koa-router');

const authRouter = new Router();

authRouter
    .post('/registration', function*() {
    })
    .post('/login', function*() {
    })
    .post('/logout', function*() {
    });

module.exports = authRouter;