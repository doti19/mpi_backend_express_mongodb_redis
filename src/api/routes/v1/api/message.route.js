const express = require('express');
const {requireJwtAuth, restrictTo} = require('../../../../middlewares/auth');
const {messageController} = require('../../../controllers');

const router = express.Router();

router.use(requireJwtAuth);

router
    .route('/')
    .get( messageController.getAllMessages)
    .post( messageController.createMessage);

router
    .route('/:id')
    .get( messageController.getMessage)
    .patch( messageController.updateMessage)
    .delete( messageController.deleteMessage);
router.patch('/read/:id', messageController.isReadMessage);

module.exports = router;
