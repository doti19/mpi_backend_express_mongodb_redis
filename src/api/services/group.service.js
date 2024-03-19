const {User: UserSchema, Group} = require('../models');
const User = UserSchema.User;

const {APIError} = require("../../errors/apiError");
const { groupJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");

const createGroup = async(body, user)=>{
    groupJoiValidator.createGroupSchema(body);
    
   
    const members = [{
        user: user.id,
        status: 'approved'
    }];
    for(const member of body.members){
        if(members.length>0){
        if(members.some(mem=>mem.user.toString()===member.user.toString())){
            continue;
        }
    }
        members.push({user: member.user, status: 'approved'});
    }
    // console.log(members);
    body.members = members;
    // console.log(membersSet);
    const group = new Group({
        ...body,
        createdBy: user.id,
    });
    await group.save();
    return group;
}

const getAllGroups = async(query, user)=>{
    const features = new APIFeatures(Group.find({ members: { $elemMatch: { user: user.id, status: 'approved' } } }), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const groups = await features.query;

    return groups;
}

const getGroup = async(id, user)=>{
    const group = await Group.findOne({_id: id, members: { $elemMatch: { user: user.id, status: 'approved' } } });
    if (!group) {
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    console.log(group.members);
    return group;
}

const joinGroup = async(id, user)=>{
    const group = await Group.findOne({ _id: id});
    if (!group) {
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    if(group.createdBy == user.id ){
        throw new APIError({
            message: "You are the creator of the group",
            status: 400,
        });
    }
    
    if(group.members.find((member)=> member.user._id == user.id)){
        throw new APIError({
            message: "You are already a member",
            status: 400,
        });
    }
    group.members.push({user: user.id, status: 'pending'});
    await group.save();
    return group;
}


const updateGroup = async(id, body, user)=>{
    groupJoiValidator.updateGroupSchema(body);
    const group = await Group.findOne({ _id: id, createdBy: user.id });
    if (!group) {
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    delete body.createdBy;
    delete body.members;
    //TODO make sure when other ppl see it, it's status is available (the groups)
    Object.keys(body).forEach((key)=>{
        group[key] = body[key];
    });
    await group.save();
    return group;
}

const updateMemberStatus = async(params, body, user)=>{
    groupJoiValidator.updateGroupMemberSchema(body);
    if(params.memberId == user.id){
        throw new APIError({
            message: "You can't change your status",
            status: 400,
        });
    }
    const group = await Group.findOne({ _id: params.groupId, createdBy: user.id });
    if (!group) {
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    const member = group.members.find((member)=> member.user._id == params.memberId);
    if (!member) {
        throw new APIError({
            message: "Member not found",
            status: 404,
        });
    }
    member.status = body.status;
    await group.save();
    return group;

}

const leaveGroup = async(id, user)=>{
    const group = await Group.findOne({ _id: id, members: { $elemMatch: { user: user.id } } });
    if (!group) {
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
    if(group.createdBy._id == user.id){
        throw new APIError({
            message: "You can't leave the group, you are the creator",
            status: 400,
        });
    }
    group.members = group.members.filter((member)=> member.user._id != user.id);
    await group.save();
    return group;
}

const deleteGroup = async(id, user)=>{
    const group = await Group.findOne({ _id: id, createdBy: user.id });
    if (!group) {
        throw new APIError({
            message: "Group not found",
            status: 404,
        });
    }
   await group.deleteOne();
   return 'successfully deleted';
}

module.exports = {
    createGroup,
    getAllGroups,
    getGroup,
    joinGroup,
    updateGroup,
    updateMemberStatus,
    leaveGroup,
    deleteGroup
}
