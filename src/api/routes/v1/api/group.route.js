const express = require('express');
const {requireJwtAuth} = require('../../../../middlewares/auth');
const {groupController} = require('../../../controllers');

const router = express.Router();


router.use(requireJwtAuth);

router
    .route('/')
    .get( groupController.getAllGroups)
    .post( groupController.createGroup);

router
    .route('/:id')
    .get( groupController.getGroup)
    .post( groupController.joinGroup)
    .patch( groupController.updateGroup)
    .delete( groupController.deleteGroup);
router.patch('/:groupId/status/:memberId', groupController.updateMemberStatus);
router.patch('/:id/leave', groupController.leaveGroup);

module.exports = router;