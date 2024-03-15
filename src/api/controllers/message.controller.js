const catchAsync = require("../../utils/catchAsync");
const { APIError } = require("../../errors/apiError");
const { messageService } = require("../services");

const createMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await messageService.createMessage(req.body, req.user);
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

const getAllMessages = catchAsync(async (req, res, next) => {
    try {
        const result = await messageService.getAllMessages(req.query, req.user);
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

const getMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await messageService.getMessage(req.params.id, req.user);
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

const updateMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await messageService.updateMessage(req.params.id, req.body, req.user);
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

const isReadMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await messageService.isReadMessage(req.params.id, req.user);
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

const deleteMessage = catchAsync(async (req, res, next) => {
    try {
        const result = await messageService.deleteMessage(req.params.id, req.user);
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
    createMessage,
    getAllMessages,
    getMessage,
    updateMessage,
    deleteMessage,
    isReadMessage,
};
