const catchAsync = require("../../utils/catchAsync");
const { APIError } = require("../../errors/apiError");
const { friendshipService } = require("../services");

const sendFriendRequest = catchAsync(async (req, res, next) => {
    try {
        const result = await friendshipService.sendFriendRequest(
            req.body,
            req.user
        );
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

const getFriendRequests = catchAsync(async (req, res, next) => {
    try {
        const result = await friendshipService.getFriendRequests(
            req.query,
            req.user
        );
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

const acceptFriendRequest = catchAsync(async (req, res, next) => {
    try {
        friendshipId = req.params.id;
        const result = await friendshipService.acceptFriendRequest(
            friendshipId,
            req.user
        );
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

const rejectFriendRequest = catchAsync(async (req, res, next) => {
    try {
        friendshipId = req.params.id;
        const result = await friendshipService.rejectFriendRequest(
            friendshipId,
            req.user
        );
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

const getFriends = catchAsync(async (req, res, next) => {
    try {
        const result = await friendshipService.getFriends(req.query, req.user);
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

const unfriend = catchAsync(async (req, res, next) => {
    try {
        friendshipId = req.params.id;
        const result = await friendshipService.unfriend(friendshipId, req.user);
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

const blockFriend = catchAsync(async (req, res, next) => {
    try {
        friendshipId = req.params.id;
        const result = await friendshipService.blockFriend(friendshipId, req.user);
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

const unblockFriend = catchAsync(async (req, res, next) => {
    try {
        friendshipId = req.params.id;
        const result = await friendshipService.unblockFriend(
            friendshipId,
            req.user
        );
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
    sendFriendRequest,
    getFriendRequests,
    acceptFriendRequest,
    rejectFriendRequest,
    getFriends,
    unfriend,
    blockFriend,
    unblockFriend,
};
