const catchAsync = require("../../utils/catchAsync");
const { APIError } = require("../../errors/apiError");
const { groupChatService } = require("../services");

const createGroupChatMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await groupChatService.createGroupChatMessage(req.body,req.params, req.user);
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

const getAllGroupChatMessages = catchAsync(async (req, res, next) => {
    try {
        const result = await groupChatService.getAllGroupChatMessages(req.query,req.params, req.user);
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

const getGroupChatMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await groupChatService.getGroupChatMessage(req.params, req.user);
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

const updateGroupChatMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await groupChatService.updateGroupChatMessage(req.params, req.body, req.user);
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

const deleteGroupChatMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await groupChatService.deleteGroupChatMessage(req.params, req.user);
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
const markGroupChatMessageAsRead = catchAsync(async (req, res, next) => {
    try {
        const result = await groupChatService.markGroupChatMessageAsRead(req.params, req.user);
        res.send(result
        );
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
    createGroupChatMessage,
    getAllGroupChatMessages,
    getGroupChatMessage,
    updateGroupChatMessage,
    deleteGroupChatMessage,
    markGroupChatMessageAsRead,
};
