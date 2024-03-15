const receiverMessages ={
    'string.base': 'Reciever must be a string',
    'string.length': 'Reciever must be 24 characters',
    'string.hex': 'Reciever must be a hexadecimal',
    'string.empty': 'Reciever must not be empty',
    'any.required': 'Reciever is required',
    
}
const senderMessages ={
    'string.base': 'Sender must be a string',
    'string.length': 'Sender must be 24 characters',
    'string.hex': 'Sender must be a hexadecimal',
    'string.empty': 'Sender must not be empty',
    'any.required': 'Sender is required',
    
}
const messageMessages ={
    'string.base': 'Message must be a string',
    'string.empty': 'Message must not be empty',
    'any.required': 'Message is required',   
}

const isReadMessages ={
    'boolean.base': 'IsRead must be a boolean',
    'any.required': 'IsRead is required',
}

//TODO is this objectId?
const conversationIdMessages ={
    'string.base': 'ConversationId must be a string',
    'string.empty': 'ConversationId must not be empty',
    'any.required': 'ConversationId is required',
}

module.exports = {
    receiverMessages,
    senderMessages,
    messageMessages,
    isReadMessages,
    conversationIdMessages
}

