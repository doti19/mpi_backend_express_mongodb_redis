const express = require('express')
const passport = require('passport')

const router = express.Router()

router.get(
    '/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
    })
)

router.get(
    '/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false,
    }),
    async (req, res) => {
        const token = await req.user.generateJWT()
        res.cookie('x-auth-cookie', {tokens: token})
        res.redirect('http://localhost:3000/api/v1/users/profile')
    }
)

module.exports = router
