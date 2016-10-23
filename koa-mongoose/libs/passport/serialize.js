const {User} = require('../../db');
const passport = require('passport');

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => User.findById(id, done));