const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');

const {
    sender,
    group,
    type,
    message,
    isRead,
    files,
    replyTo
} = require('./helpers/fields/group.chat.fields');

const createGroupChatSchema = (body)=>{
    const schema = Joi.object().keys({
        // group: group,
        type: type,
        message: message,
        files:files,
        replyTo: replyTo,
    });

    validate(schema, body);
}

const updateGroupChatSchema = (body)=>{
    const schema = Joi.object().keys({
        message: message,
        isRead: isRead,
    });
    validate(schema, body);
}

module.exports={
    createGroupChatSchema,
    updateGroupChatSchema
}
