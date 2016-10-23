const Router = require('koa-router');

const router = new Router();

router.get('/', require('./frontpage').main);
router.get('/registration', require('./frontpage').registration);

module.exports = router;