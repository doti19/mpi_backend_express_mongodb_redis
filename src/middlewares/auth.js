const passport = require('passport');




const requireJwtAuth = passport.authenticate('jwt', { session: false });


const requireLocalAuth = (req, res, next)=>{
    passport.authenticate('local', (err, user, info)=>{
        if(err){
            return next(err);
        }
        if(!user){
            return res.status(422).send(info);
        }
        req.user = user;
        next();
    })(req, res, next);
}
restrictTo = (roles) => {
    return (req, res, next) => {
      // roles is an array ['admin', 'lead-guide'], role='user'
      if (!roles.includes(req.user.role)) {
        console.log(req.user.role);
        console.log(roles)
        return next(new Error('You do not have permission to perform this action'));
      }
  
      next();
    };
  };
module.exports = {
    requireJwtAuth,
    requireLocalAuth,
    restrictTo,
};
