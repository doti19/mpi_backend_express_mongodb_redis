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
        
        await redisClient.get(`${jwt_payload.id}`).then((redisToken)=>{
            if(
                req.headers.authorization && 
                req.headers.authorization.startsWith("Bearer")
                ){
                    bearerToken = req.headers.authorization.split(" ")[1];
                }
                
                
                if(redisToken == bearerToken){
                    return done(null, false, {message: 'User already Logged Out'});
                }
        }) .catch((err)=>{
            logger.error('Error getting token from redis', err);
        });
        
            
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