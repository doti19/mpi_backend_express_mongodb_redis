const catchAsync = require("../../utils/catchAsync");
const { APIError } = require("../../errors/apiError");
const { journalService } = require("../services");

const createJournal = catchAsync(async (req, res, next) => {
    try {
        const result = await journalService.createJournal(req.body, req.user);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const getAllJournals = catchAsync(async (req, res, next) => {
    try {
        const result = await journalService.getJournals(req.query, req.user);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const getJournal = catchAsync(async (req, res, next) => {
    try {
        const result = await journalService.getJournal(req.params.id, req.user);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const updateJournal = catchAsync(async (req, res, next) => {
    try {
        const result = await journalService.updateJournal(req.params.id, req.body, req.user);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const deleteJournal = catchAsync(async (req, res, next) => {
    try {
        const result = await journalService.deleteJournal(req.params.id, req.user);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
}); 

module.exports = {
    createJournal,
    getAllJournals,
    getJournal,
    updateJournal,
    deleteJournal,
};