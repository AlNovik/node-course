const LocalStratagy = require('passport-local');
const {User} = require('../../db');

module.exports = new LocalStratagy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, done) => {
    User.findOne({email}, (err, user) => {
        if (err) {
            return done(err);
        }

        if (!user || !user.checkPassword(password)) {
            return done(null, false, {message: 'Нет такого пользователя или логин неверен'});
        }

        return done(null, user);
    })
});