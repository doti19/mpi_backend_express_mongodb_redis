const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');

const {
    journalTitleField,
    journalContentField,
    isFavoriteField,
} = require('./helpers/fields/journal.field');

const createJournalSchema = (body)=>{
    const schema = Joi.object().keys({
        title: journalTitleField,
        content: journalContentField,
        isFavorite: isFavoriteField,
    });

    validate(schema, body);
}

const updateJournalSchema = (body)=>{
    const schema = Joi.object().keys({
        title: journalTitleField,
        content: journalContentField,
        isFavorite: isFavoriteField,
    });

    validate(schema, body);
}

module.exports = {
    createJournalSchema,
    updateJournalSchema,
}