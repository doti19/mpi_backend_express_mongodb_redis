const express = require('express');
const {requireJwtAuth, restrictTo} = require('../../../../middlewares/auth');
const {courseController} = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .get(requireJwtAuth, restrictTo(['admin']), courseController.getAllCourses)
    .post(requireJwtAuth, restrictTo(['admin']), courseController.createCourse);

router
    .route('/:id')
    .get(requireJwtAuth, restrictTo(['admin']), courseController.getCourse)
    .patch(requireJwtAuth, restrictTo(['admin']), courseController.updateCourse)
    .delete(requireJwtAuth, restrictTo(['admin']), courseController.deleteCourse);
router.patch('/:id/publish', requireJwtAuth, restrictTo(['admin']), courseController.publishCourse);


// router
//     .route('/:id/curriculums')
//     .get(requireJwtAuth, restrictTo([['admin']]), courseController.getCourseCurriculums)
//     .post(requireJwtAuth, restrictTo([['admin']]), courseController.createCourseCurriculum)
//     .patch(requireJwtAuth, restrictTo([['admin']]), courseController.updateCourseCurriculum)
//     .delete(requireJwtAuth, restrictTo([['admin']]), courseController.deleteCourseCurriculum);

// router
//     .route('/:id/assessments')
//     .get(requireJwtAuth, restrictTo([['admin']]), courseController.getCourseAssessments)
//     .post(requireJwtAuth, restrictTo([['admin']]), courseController.createCourseAssessment)
//     .patch(requireJwtAuth, restrictTo([['admin']]), courseController.updateCourseAssessment)
//     .delete(requireJwtAuth, restrictTo([['admin']]), courseController.deleteCourseAssessment);

// router
//     .route('/:id/assessments/:assessmentId')
//     .get(requireJwtAuth, restrictTo([['admin']]), courseController.getCourseAssessment)
//     .post(requireJwtAuth, restrictTo([['admin']]), courseController.createCourseAssessment)
//     .patch(requireJwtAuth, restrictTo([['admin']]), courseController.updateCourseAssessment)
//     .delete(requireJwtAuth, restrictTo([['admin']]), courseController.deleteCourseAssessment);

module.exports = router;