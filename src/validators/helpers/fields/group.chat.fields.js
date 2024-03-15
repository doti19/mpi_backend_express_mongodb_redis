const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const {senderMessages,
    groupMessages,
    typeMessages,
    messageMessages,
    isReadMessages,
    filesMessages,
    replyToMessages,
    fieldNameMessages,
originalNameMessages,
encodingMessages,
mimetypeMessages,
filenameMessages,
    sizeMessages} = require('../messags/group.chat.messages');

const sender = Joi.objectId()
    .messages(senderMessages)
    .label("Sender");
const group = Joi.objectId()
    .messages(groupMessages)
    .label("Group");
const type = Joi.string()
    .valid("reply", "message")
    .messages(typeMessages)
    .label("Type");
const message = Joi.string()
    .messages(messageMessages)
    .label("Message");
const isRead = Joi.boolean()
    .messages(isReadMessages)
    .label("IsRead");
const files = Joi.array()
    .items(Joi.object().keys({
        fieldName: Joi.string()
            .messages(fieldNameMessages)
            .label("Field Name"),
        originalName: Joi.string()
            .messages(originalNameMessages)
            .label("Original Name"),
        encoding: Joi.string()
            .messages(encodingMessages)
            .label("Encoding"),
        mimetype: Joi.string()
            .messages(mimetypeMessages)
            .label("Mime Type"),
        filename: Joi.string()
            .messages(filenameMessages)
            .label("Filename"),
        size: Joi.number()
            .messages(sizeMessages)
            .label("Size"),
    }))
    .messages(filesMessages)
    .label("Files");
const replyTo = Joi.objectId()
    .messages(replyToMessages)
    .label("Reply To");

module.exports = {
    sender,
    group,
    type,
    message,
    isRead,
    files,
    replyTo
};