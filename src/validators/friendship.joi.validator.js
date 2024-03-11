const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');
const {objectId} = require('./helpers/fields');

const sendFriendRequestValidator = (body) => {
    const schema = Joi.object().keys({
        user2: objectId,
    });

    validate(schema, body);
};

const acceptFriendRequestValidator = (body) => {
    const schema = Joi.object().keys({
        user1: objectId,
    });

    validate(schema, body);
};

module.exports = {
    sendFriendRequestValidator,
    acceptFriendRequestValidator
}