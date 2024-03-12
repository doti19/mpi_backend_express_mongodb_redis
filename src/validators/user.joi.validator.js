const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');
//TODO is there any possibility that a user might change his role
const {firstName,
    lastName,
    email,
    password,
    avatar,
    dateOfBirth,
    phoneNumber,
    phoneNumberCountryCode,
    streetAddress,
    streetAddress2,
    city,
    stateProvince,
    country,
    zipCode,
    gender,
    isProfilePublic,
    emailNotificationEnabled,
    emailNotificationType,
    emailNotificationFrequency,
    pushNotificationEnabled,
    pushNotificationType,
    pushNotificationFrequency,
    relationship,
    invitationToken,
} = require('./helpers/fields');


const updateProfileValidator= (body)=>{

    const schema = Joi.object().keys({
            firstName: firstName,
            lastName: lastName,
            email: email,
            avatar: avatar,
            dateOfBirth: dateOfBirth,
            gender: gender,
            phoneNumber: phoneNumber,
            phoneNumberCountryCode: phoneNumberCountryCode,
            streetAddress: streetAddress,
            streetAddress2: streetAddress2,
            city: city,
            stateProvince: stateProvince,
            country: country,
            zipCode: zipCode,
            emailNotificationEnabled: emailNotificationEnabled,
            emailNotificationType: emailNotificationType,
            emailNotificationFrequency: emailNotificationFrequency,
            pushNotificationEnabled: pushNotificationEnabled,
            pushNotificationType: pushNotificationType,
            pushNotificationFrequency: pushNotificationFrequency,
            // role: role,
        });
        
    validate(schema, body);
        
    } 
    
const inviteUserValidator=(body)=>{
    const schema = Joi.object().keys({
        email: email.required(),
        relationship: relationship.required(),

    });
    validate(schema, body);
}

const addUserValidator = (query)=>{
    const schema = Joi.object().keys({
        token: invitationToken.required(),
        rel: relationship.required(),
    });
    validate(schema, query);
}

    module.exports = {
       updateProfileValidator,
       inviteUserValidator,
       addUserValidator,
    }
    