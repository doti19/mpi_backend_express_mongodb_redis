const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { receiverMessages,
    senderMessages,
    messageMessages,
    isReadMessages,
    conversationIdMessages} = require("../messags/course.messages");

const receiverField = Joi.objectId()
    .messages(receiverMessages)
    .label("Receiver");
const senderField = Joi.objectId()
    .messages(senderMessages)
    .label("Sender");
const messageField = Joi.string()
    .messages(messageMessages)
    .label("Message");
const isReadField = Joi.boolean()
    .messages(isReadMessages)
    .label("IsRead");
const conversationIdField = Joi.objectId()
    .messages(conversationIdMessages)
    .label("ConversationId");

module.exports = {
    receiverField,
    senderField,
    messageField,
    isReadField,
    conversationIdField
};