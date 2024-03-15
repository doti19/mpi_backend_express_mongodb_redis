const senderMessages={
    'string.base': 'Sender must be a string',
    'string.length': 'Sender must be 24 characters',
    'string.hex': 'Sender must be a hexadecimal',
    'string.empty': 'Sender must not be empty',
    'any.required': 'Sender is required',
}

const groupMessages={
    'string.base': 'Group must be a string',
    'string.length': 'Group must be 24 characters',
    'string.hex': 'Group must be a hexadecimal',
    'string.empty': 'Group must not be empty',
    'any.required': 'Group is required',
}

const typeMessages={
    'string.base': 'Type must be a string',
    'string.empty': 'Type must not be empty',
    'any.required': 'Type is required',
    'any.only': 'Type must be one of ${value}',
    'any.only': 'Type must be either reply or message'
}

const messageMessages={
    'string.base': 'Message must be a string',
    'string.empty': 'Message must not be empty',
    'any.required': 'Message is required',
}

const isReadMessages={
    'boolean.base': 'IsRead must be a boolean',
    'any.required': 'IsRead is required',
}
const fieldNameMessages={
    'string.base': 'FieldName must be a string',
    'string.empty': 'FieldName must not be empty',
    'any.required': 'FieldName is required',
}
const originalNameMessages={
    'string.base': 'OriginalName must be a string',
    'string.empty': 'OriginalName must not be empty',
    'any.required': 'OriginalName is required',
}
const encodingMessages={
    'string.base': 'Encoding must be a string',
    'string.empty': 'Encoding must not be empty',
    'any.required': 'Encoding is required',
}
const mimetypeMessages={
    'string.base': 'Mimetype must be a string',
    'string.empty': 'Mimetype must not be empty',
    'any.required': 'Mimetype is required',
}
const filenameMessages={
    'string.base': 'Filename must be a string',
    'string.empty': 'Filename must not be empty',
    'any.required': 'Filename is required',
}
const sizeMessages={
    'number.base': 'Size must be a number',
    'number.empty': 'Size must not be empty',
    'any.required': 'Size is required',
}

const filesMessages ={
    'array.base': 'Files must be an array',
    'array.empty': 'Files cannot be an empty field',
    'array.min': 'Files should have a minimum length of {#limit}',
    'any.required': 'Files is a required field',
    'array.items.object.base': 'Files should be an array of objects',
    'array.items.object.empty': 'Files should not contain empty objects',
    'array.items.object.keys': 'Files should be an array of objects with keys: fieldName, originalName, encoding, mimetype, filename, size',
    fieldName: fieldNameMessages,
    originalName: originalNameMessages,
    encoding: encodingMessages,
    mimetype: mimetypeMessages,
    filename: filenameMessages,
    size: sizeMessages
}

const replyToMessages={
    'string.base': 'ReplyTo must be a string',
    'string.empty': 'ReplyTo must not be empty',
    'any.required': 'ReplyTo is required',
}
module.exports = {
    senderMessages,
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
    sizeMessages
}