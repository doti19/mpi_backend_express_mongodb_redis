const GoogleStrategy = require('passport-google-oauth20').Strategy;

const {User} = require('../../api/models').User;
const {google} = require('../config');
/**
 * Sign in with Google.
 */

opts ={
  clientID: google.clientId,
  clientSecret: google.clientSecret,
  callbackURL: google.callbackUrl,
  // passReqToCallback: true
};

const googleLogin = new GoogleStrategy(opts, async (accessToken, refreshToken, params, profile, done) => { 
    // it should have been req, accessToken, refreshToken,params, profile, done
    // but i decided to ignore them as we are not going to use them
    // try later what happens if i just use the two params with out the _
  try{
    const oldUser = await User.findOne({"emailAddress.email": profile.emails[0].value});
    if(oldUser){
      return done(null, oldUser);
    }
 
//TODO there are fields that are not known at first, like role, and password, so we need to find a way to handle that
//TODO we need to force him to provide a password, and also a role, we can use the role to determine if he is an admin or not
    const newUser = await new User({
      provider: 'google',
      googleId: profile.id,
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      avatar: profile.photos[0].value,
    }).save();

    done(null, newUser);

  }catch (err){
    //TODO: handle error
    // logger.error(`Error with authenticating using google: ${err}`);
    done(err, false, {message: `Error with authenticating using google: ${err.message}`});
  }
  });

module.exports = googleLogin;