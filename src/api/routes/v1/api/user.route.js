const express = require('express');
const {requireJwtAuth} = require('../../../../middlewares/auth');
const {userController} = require('../../../controllers');

const router = express.Router();

router.get('/profile', requireJwtAuth, userController.profile);

router.patch('/updateprofile', requireJwtAuth, userController.updateProfile);




module.exports = router;
