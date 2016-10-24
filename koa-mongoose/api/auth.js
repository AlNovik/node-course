const Router = require('koa-router');
const passport = require('koa-passport');

const authRouter = new Router();

authRouter
    .post('/registration', function*() {
    })
    .post('/login', function*(next) {
        let ctx = this;
        yield passport.authenticate('local', function*(err, user, info) {
            if (err) throw err;
            if (user === false) {
                ctx.status = 401;
                ctx.body = { success: false }
            } else {
                yield ctx.login(user);
                ctx.body = { success: true }
            }
        }).call(this, next)
    })
    .post('/logout', function*() {
        this.logout();
        this.session = null;
        this.status = 200;
        this.body = { success: true }
    });

module.exports = authRouter;