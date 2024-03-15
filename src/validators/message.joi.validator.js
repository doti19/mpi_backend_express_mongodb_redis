const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');

const {
    receiverField,
    senderField,
    messageField,
    isReadField,
    conversationIdField,
} = require('./helpers/fields/message.fields');

const createMessageSchema = (body)=>{
    
    const schema = Joi.object().keys({
       
        receiver: receiverField.required(),
        sender: senderField.required(),
        message: messageField,
        
        // conversationId: conversationIdField,
    });

    validate(schema, body);
    // return true;
}

const updateMessageSchema = (body)=>{
    const schema = Joi.object().keys({
        message: messageField,
        isRead: isReadField,
    });
    validate(schema, body);
}


module.exports = {
    createMessageSchema,
    updateMessageSchema
} 
