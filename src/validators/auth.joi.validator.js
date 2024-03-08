const Joi = require('joi');
const {validate} = require('../helpers/schema.validation.helper');
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
    role,

    objectId,
    resetToken, 
    refreshToken
} = require('./helpers/fields');

const loginBodyValidator=(body) =>{

const schema=  Joi.object().keys({
        email: email,
        password: password,
    });
    validate(schema, body);
} 

const registerBodyValidator= (body)=>{

const schema = Joi.object().keys({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
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
        role: role,
    });
    
validate(schema, body);
    
} 

const requestPasswordResetValidator =(body)=>{
    
    const schema = Joi.object().keys({
    email: email
});

validate(schema, body);
};

const resetPasswordValidator =(body)=>{
    
    const schema = Joi.object().keys({
    password: password,
    userId: objectId,
    token: resetToken,
});

validate(schema, body);
};

const refreshTokenBodyValidator =(body)=>{
    
    const schema = Joi.object().keys({
    refreshToken: refreshToken
});

validate(schema, body);
};

module.exports = {
    loginBodyValidator,
    registerBodyValidator,

    requestPasswordResetValidator,
    resetPasswordValidator,
    refreshTokenBodyValidator,
}
