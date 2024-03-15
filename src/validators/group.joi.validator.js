const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');

const {
    groupName,
    members,
    description,
    avatar,
    chatBackgroundImage,
    memberStatus
    // status
} = require('./helpers/fields/group.fields');

const createGroupSchema = (body)=>{
    const schema = Joi.object().keys({
        groupName: groupName.required(),
        members: members,
        description: description,
        avatar: avatar,
        chatBackgroundImage: chatBackgroundImage,
        
    });

    validate(schema, body);
}

const updateGroupSchema = (body)=>{
    const schema = Joi.object().keys({
        groupName: groupName,
        members: members,
        description: description,
        avatar: avatar,
        chatBackgroundImage: chatBackgroundImage,
       
    });
    validate(schema, body);
}

const updateGroupMemberSchema = (body)=>{
    const schema = Joi.object().keys({
        status: memberStatus.required()
    });
    validate(schema, body);
}

module.exports={
    createGroupSchema,
    updateGroupSchema,
    updateGroupMemberSchema,
}