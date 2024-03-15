const {User: UserSchema, GroupChat, Group} = require('../models');
const User = UserSchema.User;

const {APIError} = require("../../errors/apiError");
const { groupChatJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");

const createGroupChatMessage = async(body, params, user)=>{
    groupChatJoiValidator.createGroupChatSchema(body);
    const group = await Group.findOne({_id: params.groupId}, { members: { $elemMatch: { user: user.id, status: 'approved' } } });
    if(!group){
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    const groupChat = new GroupChat({
        ...body,
        group: params.groupId,
        sender: user.id,
    });
    await groupChat.save();
    return groupChat;
}

const getAllGroupChatMessages = async(query, params, user)=>{
    const group = await Group.findOne({_id: params.groupId}, { members: { $elemMatch: { user: user.id, status: 'approved' } } });
    if(!group){
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    const features = new APIFeatures(GroupChat.find({ group: params.groupId }), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const groupChats = await features.query;
    return groupChats;
}

const getGroupChatMessage = async(params, user)=>{
    const group = await Group.findOne({_id: params.groupId}, { members: { $elemMatch: { user: user.id, status: 'approved' } } });
    if(!group){
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    const groupChat = await GroupChat.findOne({ _id: params.messageId, group: params.groupId });
    if (!groupChat) {
        throw new APIError({
            message: "Group chat message not found",
            status: 404,
        });
    }
    return groupChat;
}

const updateGroupChatMessage = async(params, body, user)=>{
    const group = await Group.findOne({_id: params.groupId}, { members: { $elemMatch: { user: user.id, status: 'approved' } } });
    if(!group){
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    groupChatJoiValidator.updateGroupChatSchema(body);
    const groupChat = await GroupChat.findOne({ _id: params.messageId, group: params.groupId, sender: user.id });
    if (!groupChat) {
        throw new APIError({
            message: "Group chat message not found",
            status: 404,
        });
    }
    delete body.group;
    delete body.sender;
    delete body.createdAt;
    delete body.updatedAt;
    delete body.type;
    
    Object.keys(body).forEach(key => {
        groupChat[key] = body[key];
    });
    await groupChat.save();
    return groupChat;
}


const deleteGroupChatMessage = async(params, user)=>{
    const groupChat = await GroupChat.findOne({ _id: params.messageId, group: params.groupId, sender: user.id });
    if (!groupChat) {
        throw new APIError({
            message: "Group chat message not found",
            status: 404,
        });
    }
    await groupChat.deleteOne();
    return groupChat;
}

const markGroupChatMessageAsRead = async(params, user)=>{
    const group = await Group.findOne({_id: params.groupId}, { members: { $elemMatch: { user: user.id, status: 'approved' } } });
    if(!group){
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    const groupChat = await GroupChat.findOne({ _id: params.messageId, group: params.groupId, sender: { $ne: user.id } });
    if (!groupChat) {
        throw new APIError({
            message: "Group chat message not found",
            status: 404,
        });
    }
    groupChat.isRead = true;
    groupChat.readBy.push(user.id);
    await groupChat.save();
    return groupChat;
}
module.exports = {
    createGroupChatMessage,
    getAllGroupChatMessages,
    getGroupChatMessage,
    updateGroupChatMessage,
    deleteGroupChatMessage,
    markGroupChatMessageAsRead
}

