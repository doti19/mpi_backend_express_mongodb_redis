const express = require('express');
const userRoutes = require('./user.route');
const friendshipRoutes = require('./friendship.route');
const courseRoutes = require('./course.route');
const journalRoutes = require('./journal.route');
const router = express.Router();

router.use('/users', userRoutes);
router.use('/friendship', friendshipRoutes);
router.use('/courses', courseRoutes);
router.use('/journal',journalRoutes);

module.exports = router;