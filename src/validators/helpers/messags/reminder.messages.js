const reminderTitleMessages = {
    'base.string': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'any.required': 'Title is required',

};
const reminderDescriptionMessages= {
    'base.string': 'Description must be a string',
    'string.empty': 'Description cannot be empty',
    'any.required': 'Description is required',
};

const reminderDateMessages = {
    'date.base': 'Date must be a date',
    'date.empty': 'Date cannot be empty',
    'any.required': 'Date is required',
};

const reminderUserIdMessages = {
    'base.string': 'User ID must be a string',
    'string.empty': 'User ID cannot be empty',
    'any.required': 'User ID is required',
};
const reminderIsCompletedMessages = {
    'base.boolean': 'Is completed must be a boolean',
    'any.required': 'Is completed is required',
};

module.exports = {
    reminderTitleMessages,
    reminderDescriptionMessages,
    reminderDateMessages,
    reminderUserIdMessages,
    reminderIsCompletedMessages,
};
