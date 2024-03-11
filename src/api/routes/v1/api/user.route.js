const express = require("express");
const { requireJwtAuth } = require("../../../../middlewares/auth");
const { userController } = require("../../../controllers");

const router = express.Router();

router
    .route("/profile")
    .get(requireJwtAuth, userController.viewProfile)
    .patch(requireJwtAuth, userController.updateProfile)
    .delete(requireJwtAuth, userController.deleteProfile);
router.get("/search", requireJwtAuth, userController.searchUsers);
// router.get('/:userId', requireJwtAuth, userController.getUser);
// router.patch('/deactivate', requireJwtAuth, userController.deactivateMe);

module.exports = router;
