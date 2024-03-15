const catchAsync = require("../../utils/catchAsync");
const { APIError } = require("../../errors/apiError");
const { groupService } = require("../services");

const createGroup = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.createGroup(req.body, req.user);
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

const getAllGroups = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.getAllGroups(req.query, req.user);
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

const getGroup = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.getGroup(req.params.id, req.user);
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

const joinGroup = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.joinGroup(req.params.id, req.user);
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

const updateGroup = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.updateGroup(req.params.id, req.body, req.user);
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

const updateMemberStatus = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.updateMemberStatus(req.params, req.body, req.user);
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

const leaveGroup = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.leaveGroup(req.params.id, req.user);
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

const deleteGroup = catchAsync(async (req, res, next) => {
    try {
        const result = await groupService.deleteGroup(req.params.id, req.user);
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
    createGroup,
    getAllGroups,
    getGroup,
    joinGroup,
    updateGroup,
    updateMemberStatus,
    leaveGroup,
    deleteGroup,
};