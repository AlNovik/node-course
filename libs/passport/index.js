const passport = require('koa-passport');

require('./serialize');

passport.use(require('./localStratagy'));
passport.use(require('./facebookStrategy'));

module.exports = passport;