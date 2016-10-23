const passport = require('koa-passport');

require('./serialize');

passport.use(require('./localStratagy'));

module.exports = passport;