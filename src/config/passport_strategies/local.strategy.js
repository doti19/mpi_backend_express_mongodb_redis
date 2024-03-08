const PassportLocalStrategy = require('passport-local').Strategy;
const {User} = require('../../api/models');
const {authJoiValidator} = require('../../validators');



opts ={
    usernameField: 'email',
    passwordField: 'password',
    session: false,
    passReqToCallback: true,
};

const passportLogin = new PassportLocalStrategy(opts, async(req, email, password, done)=>{
   try{
    authJoiValidator.loginBodyValidator(req.body);
   }catch(err){
    return next(err);
   }

    try{
       
        const user = await User.findOne({"emailAddress.email": email.trim()});
        
        if(!user){
            return done(null, false, {message: 'Email does not exist'});
        }
        user.comparePassword(password, (err, isMatch)=>{
            if(err){
                return done(err);
            }
            if(!isMatch){
                return done(null, false, {message: 'Incorrect password'});
            }
            return done(null, user);
        });

    }catch(err){
        return done(null, false, {message: `error with authenticating using local: ${err.message}`});
    }
}
);

module.exports = passportLogin