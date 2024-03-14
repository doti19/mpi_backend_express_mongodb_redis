const express = require("express");
const { requireJwtAuth, restrictTo } = require("../../../../middlewares/auth");
const { userController } = require("../../../controllers");

const router = express.Router();

router
    .route("/profile")
    .get(requireJwtAuth, userController.viewProfile)
    .patch(requireJwtAuth, userController.updateProfile)
    .delete(requireJwtAuth, userController.deleteProfile);
router
    .route('/profile/courses')
    .get(requireJwtAuth, restrictTo('player'), userController.viewProfileCourses);
    
router.get('player/:id/courses',requireJwtAuth, restrictTo('coach, parent'), userController.viewPlayerCourse);

router.get("/search", requireJwtAuth, userController.searchUsers);
router.post("/invite", requireJwtAuth, userController.inviteUser);
router.get('/add', requireJwtAuth, userController.addUser);

// router.get('/:userId', requireJwtAuth, userController.getUser);
// router.patch('/deactivate', requireJwtAuth, userController.deactivateMe);

module.exports = router;
