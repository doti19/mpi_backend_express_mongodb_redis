const Joi = require("joi");
const {
    journalTitle,
    journalContent,
    isFavorite,
}= require("../messags/journal.messages");

const journalTitleField = Joi.string()
    .messages(journalTitle)
    .label("Journal Title");
const journalContentField = Joi.string()
    .messages(journalContent)
    .label("Journal Content");
const isFavoriteField = Joi.boolean()
    .messages(isFavorite)
    .label("Is Favorite");

module.exports = {
    journalTitleField,
    journalContentField,
    isFavoriteField,
}