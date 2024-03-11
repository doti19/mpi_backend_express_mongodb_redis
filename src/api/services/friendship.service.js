const { Friendship, User: UserSchema } = require("../models");
const User = UserSchema.User;

const { APIError } = require("../../errors/apiError");
// const { friendshipTransformer } = require('../../transformers');
const { friendshipJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");
const { isRFC3339 } = require("validator");

const sendFriendRequest = async (body, user) => {
    try {
        friendshipJoiValidator.sendFriendRequestValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    const data = {
        user1: user.id,
        user2: body.user2,
    };

    try {
        const existingFriendship = await Friendship.findOne({
            $or: [
                { user1: user.id, user2: body.user2 },
                { user1: body.user2, user2: user.id },
            ],
        });
        if (existingFriendship) {
            return { message: "FriendRequest already exists", status: 422 };
        }

        const friendship = await Friendship.create(data);
        return friendship;
    } catch (err) {
        throw new APIError({
            message: "Error sending friend request",
            status: 501,
            stack: err.stack,
        });
    }
};

const getFriendRequests = async (query, user) => {
    try {
        console.log(user.firstName, user.id, "user");
        const apiFeatures = new APIFeatures(
            Friendship.find({
                $or: [{ user2: user.id }, { user1: user.id }],
                status: "request",
            }),
            query
        );
        const friendRequests = await apiFeatures.query;
        return { result: friendRequests.length, friendRequests };
    } catch (err) {
        throw new APIError({
            message: "Error getting friend requests",
            status: 501,
            stack: err.stack,
        });
    }
};

const acceptFriendRequest = async (friendshipId, user) => {
    // try{
    //     friendshipJoiValidator.acceptFriendRequestValidator(body);
    // }catch(err){
    //     throw new Error(err);
    // }
    // const data= {
    //     user1: body.user1,
    //     user2: user.id,
    // };
    // try{
    const friendship = await Friendship.findOne({
        _id: friendshipId,
        status: "request",
    });
    if (!friendship)
        throw new APIError({ message: "Friendship not found", status: 404 });
    if (friendship.user2._id.toString() !== user.id) {
        throw new APIError({
            message: "You are not authorized to accept this friend request",
            status: 401,
        });
    }

    friendship.status = "friends";
    const updatedFriendship = await friendship.save();
    //TODO try to do a notification thing for the one getting accepted
    return updatedFriendship;
    // }catch(err){
    //     throw new APIError({message: 'Error accepting friend request', status: 501, stack: err.stack});
    // }
};

const rejectFriendRequest = async (friendshipId, user) => {
    // try{
    //     friendshipJoiValidator.rejectFriendRequestValidator(body);
    // }catch(err){
    //     throw new Error(err);
    // }
    // const data= {
    //     user1: body.user1,
    //     user2: user.id,
    // };
    const friendship = await Friendship.findOne({
        _id: friendshipId,
        status: "request",
    });
    if (!friendship)
        throw new APIError({ message: "Friendship not found", status: 404 });
    if (friendship.user2._id.toString() !== user.id) {
        throw new APIError({
            message: "You are not authorized to accept this friend request",
            status: 401,
        });
    }

    friendship.status = "declined";
    // const updatedFriendship = await friendship.save();
    //TODO try to do a notification thing for the one getting declined
    //TODO also delete the friendship
    const updatedFriendship = await friendship.deleteOne();
    return updatedFriendship;
};

const getFriends = async (query, user) => {
    try {
        const apiFeatures = new APIFeatures(
            Friendship.find({
                $or: [{ user1: user.id }, { user2: user.id }],
                status: "friends",
            }),
            query
        );
        const friends = await apiFeatures.query;
        return { result: friends.length, friends };
    } catch (err) {
        throw new APIError({
            message: "Error getting friends",
            status: 501,
            stack: err.stack,
        });
    }
};

const unfriend = async (friendshipId, user) => {
    try {
        const friendship = await Friendship.findOne({
            _id: friendshipId,
            status: "friends",
        });
        if (!friendship)
            throw new APIError({ message: "Friendship not found", status: 404 });
        if (
            friendship.user2._id.toString() === user.id ||
            friendship.user1._id.toString() === user.id
        ) {
            const deletedFriendship = await friendship.deleteOne();
            return { message: "Unfriended successfully" };
        }
        console.log(friendship.user2._id.toString() === user.id);
        throw new APIError({
            message: "You are not authorized to accept this friend request",
            status: 401,
        });
    } catch (err) {
        console.log(err);
        throw new APIError({
            message: "Error rejecting friend request",
            status: 501,
            stack: err.stack,
        });
    }
};

const blockFriend = async (friendshipId, user) => {
    const friendship = await Friendship.findOne({
        _id: friendshipId,
        status: "friends",
    });
    if (!friendship)
        throw new APIError({ message: "Friendship not found", status: 404 });
    if (friendship.user2._id.toString() === user.id) {
        friendship.user1_blocked = true;
        const blockedFriendship = await friendship.save();
        return blockedFriendship;
    } else if (friendship.user1._id.toString() === user.id) {
        friendship.user2_blocked = true;
        return blockedFriendship;
    }
    throw new APIError({
        message: "You are not authorized to block this friend",
        status: 401,
    });
};

const unblockFriend = async (friendshipId, user) => {
    const friendship = await Friendship.findOne({
        _id: friendshipId,
        status: "friends",
    });
    if (!friendship)
        throw new APIError({ message: "Friendship not found", status: 404 });
    if (friendship.user2._id.toString() === user.id) {
        friendship.user1_blocked = false;
        const blockedFriendship = await friendship.save();
        return blockedFriendship;
    } else if (friendship.user1._id.toString() === user.id) {
        friendship.user2_blocked = false;
        return blockedFriendship;
    }
    throw new APIError({
        message: "You are not authorized to unblock this friend",
        status: 401,
    });
};

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
