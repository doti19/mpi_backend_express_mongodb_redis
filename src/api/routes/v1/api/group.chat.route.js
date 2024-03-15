const express = require('express');
const {requireJwtAuth,} = require('../../../../middlewares/auth');
const {groupChatController} = require('../../../controllers');

const router = express.Router();

router.use(requireJwtAuth);

router
    .route('/:groupId/message')
    .get( groupChatController.getAllGroupChatMessages)
    .post( groupChatController.createGroupChatMessage);

router
    .route('/:groupId/message/:messageId')
    .get( groupChatController.getGroupChatMessage)
    .patch( groupChatController.updateGroupChatMessage)
    .delete( groupChatController.deleteGroupChatMessage);
router
    .route('/:groupId/message/:messageId/read')
    .patch( groupChatController.markGroupChatMessageAsRead);

module.exports = router;
