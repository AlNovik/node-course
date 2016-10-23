const Router = require('koa-router');

const router = new Router();

router.get('/', require('./frontpage').get);

module.exports = router;