const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const logger = require('../logger');
const redisClient = require('../redis');
const {User} = require('../../api/models');
const {jwt_token} = require('../config');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwt_token.access.secret,
    issuer: jwt_token.access.issuer,
    audience: jwt_token.access.audience,
    passReqToCallback: true, 
};

const jwtLogin = new JwtStrategy(opts, async(req, jwt_payload, done)=>{
    if(Math.floor(Date.now()/1000) - jwt_payload.iat > jwt_payload.expiresIn){
        return done(null, false, {message: 'Token has expired'});
    }

    try{
        
        const redisToken = await redisClient.get(`${jwt_payload.id}`).catch((err)=>{
            logger.error('Error getting token from redis', err);
        });
        if(
            req.headers.authorization && 
            req.headers.authorization.startsWith("Bearer")
            ){
                bearerToken = req.headers.authorization.split(" ")[1];
            }
            
            
            if(redisToken == bearerToken){
                return done(null, false, {message: 'User already Logged Out'});
            }
            
            const user = await User.findById(jwt_payload.id);
            if(user){
                if(user.changedPasswordAfter(jwt_payload.iat)){
                    return done(null, false, {message: 'User has changed password, please log in again'});
                }
                return done(null, user);
            }
            return done (null, false, {message: 'User not found'});


    }catch(err){
        
        return done(err, false, {message: `Server Error: ${err}`});
    }
});

module.exports = jwtLogin;













// const myJwt = require('../config').jwt;
// // const {ExtractJwt, Strategy: JwtStrategy} = require('passport-jwt');
// const JwtStrategy = require('passport-jwt').Strategy;
// const ExtractJwt = require('passport-jwt').ExtractJwt;
// const BearerStrategy = require('passport-http-bearer').Strategy;
// // const jwt = require('jsonwebtoken');
// const User = require('../api/models/auth');
// const {tokenTypes} = require('../config/tokens');
// const passport = require('passport');
// const authProviders = require('../../utils/authProviders');

// const jwtOptions = {
//     secretOrKey: myJwt.secret,
//     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//     issuer: myJwt.issuer,
//     audience: myJwt.audience,
    
// };


// const jwt = async(payload, done)=>{
//     try{
//         if(payload.type !== tokenTypes.ACCESS){
//             throw new Error('Invalid token type');
//         }

//         const user = await User.findById(payload.sub);
//         if(!user){
//             return done(null, false);
//         }
//         done(null, user);

//     }catch(error){
//     return done(error, false);
    
//     }
// };


// const oAuth = (service) => async (req, res, next) => {
//     try{
//         const userData = await authProviders[service](token);
//         const user = await User.oAuthLogin(userData);
//         return done(null, user);
//     }catch(err){
//         return done(err, false);
//     }
//    // copilot generated code in here, maybe useful for the future
//     // passport.authenticate(service, {session: false}, (err, user) => {
//     //     if (err || !user) {
//     //         return next(err);
//     //     }
//     //     req.user = user;
//     //     return next();
//     // })(req, res, next);
// };


// exports.jwtStrategy = new JwtStrategy(jwtOptions, jwt);
// exports.google = new BearerStrategy(oAuth('google'));