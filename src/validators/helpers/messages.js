const firstNameMessages = {
    'string.base': 'First Name must be a string',
    'string.empty': 'First Name is required',
    'string.min': 'First Name must be at least {#limit} characters',
    'string.max': 'First Name must not exceed {#limit} characters',
    'any.required': 'Name is required',
}

const lastNameMessages = {
    'string.base': 'Last Name must be a string',
    'string.min': 'Last Name must be at least {#limit} characters',
    'string.max': 'Last Name must not exceed {#limit} characters',
}

const emailMessages = {
    'string.base': 'Email must be a string',
    'string.empty': 'Email is required',
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
}

const verifiedMessages = {
    'boolean.base': 'Verified must be a boolean',
}

const ageMessages = {
    'number.base': 'Age must be a number',
    'number.empty': 'Age is required',
    'number.integer': 'Age must be an integer',
    'number.min': 'Age must be at least {#limit}',
    'number.max': 'Age must not exceed {#limit}',
}

const passwordMessages = {
    'string.base': 'Password must be a string',
    'string.min': 'Password must be at least {#limit} characters',
    'string.max': 'Password must not exceed {#limit} characters',
}

const dateOfBirthMessages = {
    'date.base': 'Date of Birth must be a valid date',
    'date.empty': 'Date of Birth is required',
    'any.required': 'Date of Birth is required',
    // "date.max": "Date of Birth cannot be greater than today",
    // "date.min": "Date of Birth cannot be less than 1900-01-01",
}

const phoneNumberMessages = {
    'string.base': 'Phone Number must be a string',
    'string.empty': 'Phone Number is required',
    'string.min': 'Phone Number must be at least {#limit} characters',
    'string.max': 'Phone Number must not exceed {#limit} characters',
    'string.pattern.base': 'Phone Number must be a valid phone number',
    'any.required': 'Phone Number is required',
}

const phoneNumberCountryCodeMessages = {
    'string.base': 'Phone Number Country Code must be a string',
    'string.empty': 'Phone Number Country Code is required',
    'string.length': 'Phone Number Country Code must be {#limit} characters',
    'string.pattern.base': 'Phone Number Country Code must be a valid phone number code',
    'any.required': 'Phone Number Country Code is required',
}

const streetAddressMessages = {
    'string.base': 'Street Address must be a string',
    'string.empty': 'Street Address is required',
    'string.min': 'Street Address must be at least {#limit} characters',
    'string.max': 'Street Address must not exceed {#limit} characters',
    'any.required': 'Street Address is required',
}

const streetAddress2Messages = {
    'string.base': 'Street Address must be a string',
    'string.min': 'Street Address must be at least {#limit} characters',
    'string.max': 'Street Address must not exceed {#limit} characters',
}

const cityMessages = {
    'string.base': 'City must be a string',
    'string.empty': 'City is required',
    'string.min': 'City must be at least {#limit} characters',
    'string.max': 'City must not exceed {#limit} characters',
    'any.required': 'City is required',
}

const stateProvinceMessages = {
    'string.base': 'State/Province must be a string',
    'string.empty': 'State/Province is required',
    'string.min': 'State/Province must be at least {#limit} characters',
    'string.max': 'State/Province must not exceed {#limit} characters',
    'any.required': 'State/Province is required',
};

const countryMessages = {
    'string.base': 'Country must be a string',
    'string.empty': 'Country is required',
    'string.min': 'Country must be at least {#limit} characters',
    'string.max': 'Country must not exceed {#limit} characters',
    'any.required': 'Country is required',
};

const zipCodeMessages = {
    'string.base': 'Zip Code must be a string',
    'string.empty': 'Zip Code is required',
    'string.min': 'Zip Code must be at least {#limit} characters',
    'string.max': 'Zip Code must not exceed {#limit} characters',
    'any.required': 'Zip Code is required',
}

const genderMessages = {
    'string.base': 'Gender must be a string',
    'string.empty': 'Gender is required',
    'any.required': 'Gender is required',
    'any.only': 'Gender must be one of the allowed values: {#valids}',
}

const isProfilePublicMessages = {
    'boolean.base': 'Is Profile Public must be a boolean',
}

const emailNotificationEnabledMessages = {
    'boolean.base': 'Email Notification Enabled must be a boolean',
}
const emailNotificationTypeMessages = {
    'array.base': 'Email Notification Type must be an array',
    'array.empty': 'Email Notification Type cannot be an empty array',
    'array.unique': 'Email Notification Type must be unique',
    'array.min': 'Email Notification Type must have at least {#limit} items',
    'array.max': 'Email Notification Type must not exceed {#limit} items',
    'array.includes': 'Email Notification Type must include {#values}',
    'array.includesSingle': 'Email Notification Type must include {#values}',
    'array.includesRequiredUnknowns': 'Email Notification Type must include {#values}',
    'array.includesRequiredKnowns': 'Email Notification Type must include {#values}',
    'array.sparse': 'Email Notification Type must not be a sparse array',
    'array.items': 'Email Notification Type must contain an array of strings',
    'array.items.string.base': 'Email Notification Type must contain an array of strings',
    'array.items.string.empty': 'Email Notification Type must contain an array of strings',
    'array.items.string.min': 'Email Notification Type must contain an array of strings',
    'array.items.string.max': 'Email Notification Type must contain an array of strings',
    'array.items.string.pattern.base': 'Email Notification Type must contain an array of strings',
    'array.items.any.only': 'Email Notification Type must contain an array of strings',
}

const emailNotificationFrequencyMessages = {
    'string.base': 'Email Notification Frequency must be a string',
    'any.only':
        'Email Notification Frequency must be one of the allowed values: {#valids}',
}

const pushNotificationEnabledMessages = {
    'boolean.base': 'Push Notification Enabled must be a boolean',
}

const pushNotificationTypeMessages = {
    'array.base': 'Push Notification Type must be an array',
    'array.empty': 'Push Notification Type cannot be an empty array',
    'array.unique': 'Push Notification Type must be unique',
    'array.min': 'Push Notification Type must have at least {#limit} items',
    'array.max': 'Push Notification Type must not exceed {#limit} items',
    'array.includes': 'Push Notification Type must include {#values}',
    'array.includesSingle': 'Push Notification Type must include {#values}',
    'array.includesRequiredUnknowns': 'Push Notification Type must include {#values}',
    'array.includesRequiredKnowns': 'Push Notification Type must include {#values}',
    'array.sparse': 'Push Notification Type must not be a sparse array',
    'array.items': 'Push Notification Type must contain an array of strings',
    'array.items.string.base': 'Push Notification Type must contain an array of strings',
    'array.items.string.empty': 'Push Notification Type must contain an array of strings',
    'array.items.string.min': 'Push Notification Type must contain an array of strings',
    'array.items.string.max': 'Push Notification Type must contain an array of strings',
    'array.items.string.pattern.base': 'Push Notification Type must contain an array of strings',
    'array.items.any.only': 'Push Notification Type must contain an array of strings',
}

const pushNotificationFrequencyMessages = {
    'string.base': 'Push Notification Frequency must be a string',
    'any.only':
        'Push Notification Frequency must be one of the allowed values: {#valids}',
}

const avatarMessages = {
    'string.uri': 'Avatar must be a valid URL',
}

const roleMessages = {
    'string.base': 'Role must be a string',
    'string.empty': 'Role is required',
    'any.required': 'Role is required',
    'any.only': 'Role must be one of the allowed values: {#valids}',
}

const refreshTokenMessages = {
    'string.base': 'Refresh Token must be a string',
    'string.empty': 'Refresh Token is required',
    'any.required': 'Refresh Token is required',
}

const objectIdMessages = {
    'string.base': 'ObjectId must be a string',
    'string.length': 'ObjectId must be 24 characters',
    'string.hex': 'ObjectId must be a hexadecimal',
    'string.empty': 'ObjectId must not be empty',
    'any.required': 'ObjectId is required',
}

const resetTokenMessages = {
    'string.base': 'Reset Token must be a string',
    'string.empty': 'Reset Token cannot be an empty field',
    'string.hex': 'Reset Token must be a hexadecimal string',
    'string.length': 'Reset Token should be 64 characters long',
    'any.required': 'Reset Token is required',
}

const invitationTokenMessages = {
    'string.base': 'Invitation Token must be a string',
    'string.empty': 'Invitation Token cannot be an empty field',
    'string.hex': 'Invitation Token must be a hexadecimal string',
    'string.length': `Invitation Token should be 32 characters long`,
    'any.required': 'Invitation Token is required',
}

const relationshipMessages ={
    'string.base': 'Relationship must be a string',
    'string.empty': 'Relationship is required',
    'any.required': 'Relationship is required',
    'any.only': 'Relationship must be one of the allowed values: {#valids}',
}

module.exports = {
    firstNameMessages,
    lastNameMessages,
    emailMessages,
    ageMessages,
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
    emailNotificationFrequencyMessages,
    pushNotificationEnabledMessages,
    pushNotificationTypeMessages,
    pushNotificationFrequencyMessages,
    roleMessages,
    refreshTokenMessages,
    objectIdMessages,
    resetTokenMessages,
    relationshipMessages,
    invitationTokenMessages
}
