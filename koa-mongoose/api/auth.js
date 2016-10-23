const Router = require('koa-router');
const passport = require('koa-passport');

const authRouter = new Router();

authRouter
    .post('/registration', function*() {
    })
    .post('/login', function*() {
        yield passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/',
            //failureMessage: true // запишет сообщение об ошибке в session.messages[]
            failureFlash: true // req.flash, better

            // assignProperty: 'something' присвоить юзера в свойство req.something
            //   - нужно для привязывания акков соц. сетей
            // если не стоит, то залогинит его вызовом req.login(user),
            //   - это поместит user.id в session.passport.user (если не стоит опция session:false)
            //   - также присвоит его в req.user
        });
    })
    .post('/logout', function*() {
        this.logout();
        this.session = null;
    });

module.exports = authRouter;