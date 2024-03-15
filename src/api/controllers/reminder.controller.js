const catchAsync = require("../../utils/catchAsync");
const { APIError } = require("../../errors/apiError");
const { reminderService } = require("../services");

const createReminder = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.createReminder(req.body, req.user);
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

const getReminders = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.getReminders(req.query, req.user);
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

const getReminder = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.getReminder(req.params.id, req.user);
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

const updateReminder = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.updateReminder(req.params.id, req.body, req.user);
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

const deleteReminder = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.deleteReminder(req.params.id, req.user);
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

const getRemindersByPlayerId = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.getRemindersByPlayerId(req.params.playerId, req.user);
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

const createReminderByPlayerId = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.createReminderByPlayerId(req.params.playerId, req.body, req.user);
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

const getReminderByPlayerId = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.getReminderByPlayerId(req.params, req.user);
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

const updateReminderByPlayerId = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.updateReminderByPlayerId(req.params, req.body, req.user);
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

const deleteReminderByPlayerId = catchAsync(async (req, res, next) => {
    try {
        const result = await reminderService.deleteReminderByPlayerId(req.params, req.user);
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
    createReminder,
    getReminders,
    getReminder,
    updateReminder,
    deleteReminder,

    getRemindersByPlayerId,
    createReminderByPlayerId,
    getReminderByPlayerId,
    updateReminderByPlayerId,
    deleteReminderByPlayerId,
};