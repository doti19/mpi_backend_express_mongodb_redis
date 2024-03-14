const express = require('express');
const {requireJwtAuth, restrictTo} = require('../../../../middlewares/auth');
const {journalController} = require('../../../controllers');

const router = express.Router();

router
    .route('/')
    .get(requireJwtAuth, restrictTo(['player']), journalController.getAllJournals)
    .post(requireJwtAuth, restrictTo(['player']), journalController.createJournal);

router
    .route('/:id')
    .get(requireJwtAuth, restrictTo(['player']), journalController.getJournal)
    .patch(requireJwtAuth, restrictTo(['player']), journalController.updateJournal)
    .delete(requireJwtAuth, restrictTo(['player']), journalController.deleteJournal);

module.exports = router;
