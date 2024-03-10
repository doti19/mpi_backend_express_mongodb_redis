const express = require('express');
const {requireJwtAuth} = require('../../../../middlewares/auth');
const {userController} = require('../../../controllers');


const router = express.Router();

router
    .route('/profile')
    .get(requireJwtAuth, userController.profile)
    .patch(requireJwtAuth, userController.updateProfile);

// router.delete('/:id', requireJwtAuth, userController.deleteMe);

// router.patch('/deactivate', requireJwtAuth, userController.deactivateMe);

module.exports = router;
