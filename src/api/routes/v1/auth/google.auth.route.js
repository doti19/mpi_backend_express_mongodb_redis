const express = require('express')
const passport = require('passport')
const {requireJwtAuth} = require('../../../../middlewares/auth')
const router = express.Router()
const {links} = require('../../../../config/config'); 
const { info } = require('winston');
router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
)

router.get(
    '/google/callback',
    (req, res, next) => {
        passport.authenticate('google', { session: false }, (err, user, info) => {
            console.log('user', user);
            
            if (err) {
                // Handle error
                //TODO: create an error page
                console.log('inside error');
                return res.redirect(`${links.baseUrl}/error`);
            }
            // if(info.registration==true){
            //     console.log('inside registration');

            //     return res.redirect(`${links.baseUrl}/auth/complete-registration`);
            // }
            if (!user) {
                console.log('no user')
                // Authentication failed
                return res.redirect(`${links.baseUrl}/error`);
            }
            // Authentication succeeded
            req.logIn(user, { session: false }, async (err) => {
                console.log('inside login')
                if (err) {
                    return next(err);
                }
                
                const token = await req.user.generateJWT();
                res.cookie('x-auth-cookie', {tokens: token});
                
                if(info.registered){
                    console.log(token, 'is registered')
                    res.redirect(`${links.baseUrl}/api/v1/users/profile`);
                }else{
                    console.log(token, 'didnot completly registered')
                    
                    res.redirect(`${links.baseUrl}/auth/complete-registration`);
                }
            });
        })(req, res, next);
    }
)

module.exports = router
