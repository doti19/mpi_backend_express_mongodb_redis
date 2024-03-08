const passport = require('passport');
const googleStrategy = require('./passport_strategies/google.strategy');
const localStrategy = require('./passport_strategies/local.strategy');
const jwtStrategy = require('./passport_strategies/jwt.strategy');


passport.use(jwtStrategy);
passport.use(googleStrategy);
passport.use(localStrategy);

module.exports = passport;