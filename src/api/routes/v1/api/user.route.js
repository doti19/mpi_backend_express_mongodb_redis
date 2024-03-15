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
    .get(requireJwtAuth, restrictTo(['player']), userController.viewProfileCourses);

router.patch('/profile/courses/:courseId', requireJwtAuth, restrictTo(['player']), userController.updateCourseProgress);

router.route('/profile/dashboard')
    .get(requireJwtAuth, restrictTo(['player']), userController.viewProfileDashboard);
router.get('/player/:id/courses',requireJwtAuth, restrictTo(['coach','parent']), userController.viewPlayerCourse);

router.get('/children', requireJwtAuth, restrictTo(['parent']), userController.viewChildren);
router.get('/children/:id', requireJwtAuth, restrictTo(['parent']), userController.viewChild);
router.get('/children/:id/coaches', requireJwtAuth, restrictTo(['parent']), userController.viewChildCoaches);
router.get('/children/:id/coaches/:coachId', requireJwtAuth, restrictTo(['parent']), userController.viewChildCoach);

router.get('/players', requireJwtAuth, restrictTo(['coach']), userController.viewPlayers);
router.get('/players/:id', requireJwtAuth, restrictTo(['coach']), userController.viewPlayer);
router.get('/players/:id/parents', requireJwtAuth, restrictTo(['coach']), userController.viewPlayerParents);
router.get('/players/:id/parents/:parentId', requireJwtAuth, restrictTo(['coach']), userController.viewPlayerParent);

router.get("/search", requireJwtAuth, userController.searchUsers);
router.post("/invite", requireJwtAuth, userController.inviteUser);
router.get('/add', requireJwtAuth, userController.addUser);

// router.get('/:userId', requireJwtAuth, userController.getUser);
// router.patch('/deactivate', requireJwtAuth, userController.deactivateMe);

module.exports = router;
