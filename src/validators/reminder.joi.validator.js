const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');

const{
    reminderTitle,
    reminderDescription,
    reminderDate,
    reminderUserId,
    reminderIsCompleted,
    reminderCreatedAtMessages
} = require('./helpers/fields/reminder.fields');


const createReminderSchema = (body)=>{
    const schema = Joi.object().keys({
        title: reminderTitle.required(),
        description: reminderDescription.required(),
        date: reminderDate.required(),
        
        
    });

    validate(schema, body);
}


const updateReminderSchema = (body)=>{
    const schema = Joi.object().keys({
        title: reminderTitle,
        description: reminderDescription,
        date: reminderDate,
        isCompleted: reminderIsCompleted,
    });
    validate(schema, body);
}

module.exports = {
    createReminderSchema,
    updateReminderSchema
}