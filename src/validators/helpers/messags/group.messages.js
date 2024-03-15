const groupNameMessages={
    "string.base": "Group name must be a string",
    "string.empty": "Group name must not be empty",
    "any.required": "Group name is required",

}
const userMessages={
    'string.base': 'User must be a string',
    'string.length': 'User must be 24 characters',
    'string.hex': 'User must be a hexadecimal',
    'string.empty': 'User must not be empty',
    'any.required': 'User is required',
}
const memberStatusMessages={
    'string.base': 'Status must be a string',
    'string.empty': 'Status must not be empty',
    'any.required': 'Status is required',
    'any.only': 'Status must be one of ${value}',
    'any.only': 'Status must be either active or inactive'
}

const membersMessages={
    'array.base': 'Members must be an array',
    'array.empty': 'Members must not be an empty',
    'any.required': 'Members is required',
    'array.items': 'Members must be an array of objects',
    'array.items.object.base': 'Members must be an array of objects',
    'array.items.object.required': 'Members must be an array of objects',
    'array.items.object.keys': 'Members must be an array of  objects with keys: user and status',
    user: userMessages,
    status: memberStatusMessages
}
const descriptionMessages={
    'string.base': 'Description must be a string',
    'string.empty': 'Description must not be empty',
    'any.required': 'Description is required',
}

const avatarMessages={
    'string.base': 'Avatar must be a string',
    'string.empty': 'Avatar must not be empty',
    'any.required': 'Avatar is required',
}

const chatBackgroundImageMessages={
    'string.base': 'Chat background image must be a string',
    'string.empty': 'Chat background image must not be empty',
    'any.required': 'Chat background image is required',
}

const statusMessages={
    'string.base': 'Status must be a string',
    'string.empty': 'Status must not be empty',
    'any.required': 'Status is required',
    'any.only': 'Status must be one of ${value}',
    'any.only': 'Status must be either available, not available, delete, violated terms'
}

module.exports = {
    groupNameMessages,
    membersMessages,
    userMessages,
memberStatusMessages,
    descriptionMessages,
    avatarMessages,
    chatBackgroundImageMessages,
    statusMessages
}