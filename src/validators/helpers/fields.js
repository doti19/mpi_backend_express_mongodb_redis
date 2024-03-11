const Joi = require('joi')
const {
    firstNameMessages,
    lastNameMessages,
    emailMessages,
    passwordMessages,
    avatarMessages,
    verifiedMessages,
    dateOfBirthMessages,
    phoneNumberMessages,
    phoneNumberCountryCodeMessages,
    streetAddressMessages,
    streetAddress2Messages,
    cityMessages,
    stateProvinceMessages,
    countryMessages,
    zipCodeMessages,
    genderMessages,
    isProfilePublicMessages,
    emailNotificationEnabledMessages,
    emailNotificationTypeMessages,
    emailNotificationFrequencyMessages,
    pushNotificationEnabledMessages,
    pushNotificationTypeMessages,
    pushNotificationFrequencyMessages,
    roleMessages,
    refreshTokenMessages,
    objectIdMessages,
    resetTokenMessages,
} = require('./messages')

avatar = Joi.string()
    .uri()
    .allow('')
    .allow(null)
    .messages(avatarMessages)
    .label('Avatar')

firstName = Joi.string()
    .min(2)
    .max(30)
    // .required()
    .messages(firstNameMessages)
    .label('First Name')
lastName = Joi.string()
    .min(2)
    .max(30)
    .messages(lastNameMessages)
    .label('Last Name')
password = Joi.string()
    .min(6)
    .max(20)
    .allow('')
    .allow(null)
    .messages(passwordMessages)
    .label('Password')
email = Joi.string()
    .email()
    // .required()
    .messages(emailMessages)
    .label('Email')
verified = Joi.boolean()
    .messages(verifiedMessages)
    .label('Verified')
dateOfBirth = Joi.date()
    // .required()
    .min('1-1-1900')
    .max('now')
    .messages(dateOfBirthMessages)
    .label('Date of Birth')
gender = Joi.string()
    .valid('male', 'female', 'other')
    // .required()
    .messages(genderMessages)
    .label('Gender')
phoneNumber = Joi.string()
    // .required()
    .min(7)
    .max(15)
    .pattern(/^[0-9]+/)
    .messages(phoneNumberMessages)
    .label('Phone Number')
phoneNumberCountryCode= Joi.string()
    // .required()
    .length(2)
    .pattern(/^[A-Z]{2}/)
    .messages(phoneNumberCountryCodeMessages)
    .label('Country Code')

streetAddress = Joi.string()
    // .required()
    .min(3)
    .max(50)
    .messages(streetAddressMessages)
    .label('Street Address')
streetAddress2 = Joi.string()
    .min(3)
    .max(50)
    .messages(streetAddress2Messages)
    .label('Street Address 2')
city = Joi.string()
    // .required()
    .min(3)
    .max(50)
    .messages(cityMessages)
    .label('City')
stateProvince = Joi.string()
    // .required()
    .min(3)
    .max(50)
    .messages(stateProvinceMessages)
    .label('State Province')
country = Joi.string()
    // .required()
    .min(3)
    .max(50)
    .messages(countryMessages)
    .label('Country')
zipCode = Joi.string()
    // .required()
    .min(3)
    .max(50)
    .messages(zipCodeMessages)
    .label('Zip Code')
isProfilePublic = Joi.boolean()
    .messages(isProfilePublicMessages)
    .label('Is Profile Public')
emailNotificationEnabled = Joi.boolean()
    .messages(emailNotificationEnabledMessages)
    .label('Email Notification Enabled')
emailNotificationType = Joi.array()
    .items(Joi.string().valid('newMatch', 'matchReminder', 'matchResult', 'friendActivity'))
    .min(1)
    .max(4)
    .unique()
    .messages(emailNotificationTypeMessages)
    .label('Email Notification Type')
emailNotificationFrequency = Joi.string()
    .valid('daily', 'weekly', 'monthly')
    .messages(emailNotificationFrequencyMessages)
    .label('Email Notification Frequency')
pushNotificationEnabled = Joi.boolean()
    .messages(pushNotificationEnabledMessages)
    .label('Push Notification Enabled')
pushNotificationType = Joi.array()
    .items(Joi.string().valid('newMatch', 'matchReminder', 'matchResult', "friendActivity", "homework"))
    .min(1)
    .max(5)
    .messages(pushNotificationTypeMessages)
    .label('Push Notification Type')
pushNotificationFrequency = Joi.string()
    .valid('daily', 'weekly', 'monthly')
    .messages(pushNotificationFrequencyMessages)
    .label('Push Notification Frequency')

role = Joi.string()
    .valid('player', 'coach', 'parent')
    // .required()
    .lowercase()
    .trim()
    .messages(roleMessages)
    .label('Role')

refreshToken = Joi.string()
    // .required()
    .messages(refreshTokenMessages)
    .label('Refresh Token')
objectId = Joi.string()
    .hex()
    .length(24)
    .messages(objectIdMessages)
    .label('Object Id')
resetToken = Joi.string()
    .length(64)
    .hex()
    // .required()
    .messages(resetTokenMessages)
    .label('Reset Token')
module.exports = {
    firstName,
    lastName,
    email,
    password,
    avatar,
    verified,
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
    emailNotificationFrequency,
    pushNotificationEnabled,
    pushNotificationType,
    pushNotificationFrequency,
    role,
    
    refreshToken,
    objectId,
    resetToken,
}
