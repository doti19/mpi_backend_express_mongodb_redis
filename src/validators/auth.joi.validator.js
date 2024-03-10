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
        email: email.required(),
        password: password.required(),
    });
    validate(schema, body);
} 

const changePasswordValidator=(body)=>{
    const schema = Joi.object().keys({
        oldPassword: password.required(),
        newPassword: password.required(),
    });
    validate(schema,body);
    };

const registerBodyValidator= (body)=>{

const schema = Joi.object().keys({
        firstName: firstName.required(),
        lastName: lastName,
        email: email.required(),
        password: password.required(),
        avatar: avatar,
        dateOfBirth: dateOfBirth.required(),
        gender: gender.required(),
        phoneNumber: phoneNumber.required(),
        phoneNumberCountryCode: phoneNumberCountryCode.required(),
        streetAddress: streetAddress,
        streetAddress2: streetAddress2,
        city: city.required(),
        stateProvince: stateProvince.required(),
        country: country.required(),
        zipCode: zipCode,
        emailNotificationEnabled: emailNotificationEnabled,
        emailNotificationType: emailNotificationType,
        emailNotificationFrequency: emailNotificationFrequency,
        pushNotificationEnabled: pushNotificationEnabled,
        pushNotificationType: pushNotificationType,
        pushNotificationFrequency: pushNotificationFrequency,
        role: role.required(),
    });
    
validate(schema, body);
    
} 

const requestPasswordResetValidator =(body)=>{
    
    const schema = Joi.object().keys({
    email: email.requied(),
});

validate(schema, body);
};

const resetPasswordValidator =(body)=>{
    
    const bodySchema = Joi.object().keys({
    password: password.required(),
    email: email.required(),
    token: resetToken.required()
});



validate(bodySchema, body);
};

const refreshTokenBodyValidator =(body)=>{
    
    const schema = Joi.object().keys({
    refreshToken: refreshToken.required(),
});

validate(schema, body);
};

module.exports = {
    loginBodyValidator,
    registerBodyValidator,
    changePasswordValidator,

    requestPasswordResetValidator,
    resetPasswordValidator,
    refreshTokenBodyValidator,
}
