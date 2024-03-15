const express = require('express');
const userRoutes = require('./user.route');
const friendshipRoutes = require('./friendship.route');
const courseRoutes = require('./course.route');
const journalRoutes = require('./journal.route');
const messageRoutes = require('./message.route');
const groupChatRoutes = require('./group.chat.route');
const groupRoutes = require('./group.route');
const reminderRoutes = require('./reminder.route');
const router = express.Router();

router.use('/users', userRoutes);
router.use('/friendship', friendshipRoutes);
router.use('/courses', courseRoutes);
router.use('/journals',journalRoutes);
router.use('/messages', messageRoutes);
router.use('/group-chats', groupChatRoutes);
router.use('/groups', groupRoutes);
router.use('/reminders', reminderRoutes);

module.exports = router;