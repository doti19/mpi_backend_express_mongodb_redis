const express = require('express');
const userRoutes = require('./user.route');
const friendshipRoutes = require('./friendship.route')
const router = express.Router();

router.use('/users', userRoutes);
router.use('/friendship', friendshipRoutes);

module.exports = router;