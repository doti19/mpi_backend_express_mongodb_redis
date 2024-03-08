const express = require('express');

// const userRoutes = require('./users.route');
const localAuthRoutes = require('./local.auth.route');
const googleAuthRoutes = require('./google.auth.route');


const router = express.Router();



// Define your routes here
router.use('/', localAuthRoutes);
router.use('/', googleAuthRoutes);



module.exports = router;