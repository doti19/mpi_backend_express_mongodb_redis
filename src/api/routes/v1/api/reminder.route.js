const express = require("express");
const { requireJwtAuth, restrictTo } = require("../../../../middlewares/auth");
const { reminderController } = require("../../../controllers");

const router = express.Router();

router
    .route("/")
    .post(requireJwtAuth, restrictTo(['player']), reminderController.createReminder)
    .get(requireJwtAuth, restrictTo(['player']), reminderController.getReminders);

router
    .route("/:id")
    .get(requireJwtAuth, restrictTo(['player']), reminderController.getReminder)
    .patch(requireJwtAuth, restrictTo(['player']), reminderController.updateReminder)
    .delete(requireJwtAuth, restrictTo(['player']), reminderController.deleteReminder);

router
    .route('/player/:playerId')
    .get(requireJwtAuth, restrictTo(['parent', 'coach']), reminderController.getRemindersByPlayerId)
    .post(requireJwtAuth, restrictTo(['parent', 'coach']), reminderController.createReminderByPlayerId)
    
router
    .route('/player/:playerId/:reminderId')
    .get(requireJwtAuth, restrictTo(['parent', 'coach']), reminderController.getReminderByPlayerId)
    .patch(requireJwtAuth, restrictTo(['parent', 'coach']), reminderController.updateReminderByPlayerId)
    .delete(requireJwtAuth, restrictTo(['parent', 'coach']), reminderController.deleteReminderByPlayerId);

module.exports = router;
