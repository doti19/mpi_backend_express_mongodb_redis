const Joi = require('joi');

const {
    reminderTitleMessages,
    reminderDescriptionMessages,
    reminderDateMessages,
    reminderUserIdMessages,
    reminderIsCompletedMessages,
    reminderCreatedAtMessages
} = require('../messags/reminder.messages');


const reminderTitle = Joi.string()
    .messages(reminderTitleMessages)
    .label('Title');

const reminderDescription = Joi.string()
    .messages(reminderDescriptionMessages)
    .label('Description');

const reminderDate = Joi.date()
    .messages(reminderDateMessages)
    .label('Date');

const reminderUserId = Joi.string()
    .messages(reminderUserIdMessages)
    .label('User ID');

const reminderIsCompleted = Joi.boolean()
    .messages(reminderIsCompletedMessages)
    .label('Is completed');

module.exports = {
    reminderTitle,
    reminderDescription,
    reminderDate,
    reminderUserId,
    reminderIsCompleted,
    reminderCreatedAtMessages
};