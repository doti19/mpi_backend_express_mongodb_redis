const registerBodyTransformer = (body)=>{
    const bodyCopy = {...body};
        delete bodyCopy.email;
        delete bodyCopy.phoneNumber;
        delete bodyCopy.phoneNumberCountryCode;
        delete bodyCopy.streetAddress;
        if(bodyCopy.streetAddress2) delete bodyCopy.streetAddress2;
        delete bodyCopy.city;
        delete bodyCopy.stateProvince;
        delete bodyCopy.country;
        if(bodyCopy.zipCode) delete bodyCopy.zipCode;
        delete bodyCopy.emailNotificationEnabled;
        delete bodyCopy.emailNotificationType;
        delete bodyCopy.emailNotificationFrequency;
        delete bodyCopy.pushNotificationEnabled;
        delete bodyCopy.pushNotificationType;
        delete bodyCopy.pushNotificationFrequency;
        delete bodyCopy.role;
       return {
            provider: 'local',
            
            emailAddress:{
                email: body.email
            },
            phoneNumber:{
                number: body.phoneNumber,
                countryCode: body.phoneNumberCountryCode
            },
            address:{
                streetAddress: body.streetAddress,
                streetAddress2: body.streetAddress2? body.streetAddress2: null,
                city: body.city,
                stateProvince: body.stateProvince,
                country: body.country,
                zipCode: body.zipCode? body.zipCode: null,
            },
            notificationPreference:{
                emailNotification:{
                    enabled: body.emailNotificationEnabled,
                    notificationType: body.emailNotificationType,
                    notificationFrequency: body.emailNotificationFrequency
                },
                pushNotification:{
                    enabled: body.pushNotificationEnabled,
                    notificationType: body.pushNotificationType,
                    notificationFrequency: body.pushNotificationFrequency
                },
                },
                role: body.role.toString().toLowerCase().trim(),
                ...bodyCopy,
            
        }
}

const completeRegisterBodyTransformer = (body)=>{
    const bodyCopy = {...body};
        if(bodyCopy.email)delete bodyCopy.email;
        
        delete bodyCopy.phoneNumber;
        delete bodyCopy.phoneNumberCountryCode;
        delete bodyCopy.streetAddress;
        if(bodyCopy.streetAddress2) delete bodyCopy.streetAddress2;
        delete bodyCopy.city;
        delete bodyCopy.stateProvince;
        delete bodyCopy.country;
        if(bodyCopy.zipCode) delete bodyCopy.zipCode;
        delete bodyCopy.emailNotificationEnabled;
        delete bodyCopy.emailNotificationType;
        delete bodyCopy.emailNotificationFrequency;
        delete bodyCopy.pushNotificationEnabled;
        delete bodyCopy.pushNotificationType;
        delete bodyCopy.pushNotificationFrequency;
        delete bodyCopy.role;
       return {
            provider: 'local',
            
            phoneNumber:{
                number: body.phoneNumber,
                countryCode: body.phoneNumberCountryCode
            },
            address:{
                streetAddress: body.streetAddress,
                streetAddress2: body.streetAddress2? body.streetAddress2: null,
                city: body.city,
                stateProvince: body.stateProvince,
                country: body.country,
                zipCode: body.zipCode? body.zipCode: null,
            },
            notificationPreference:{
                emailNotification:{
                    enabled: body.emailNotificationEnabled,
                    notificationType: body.emailNotificationType,
                    notificationFrequency: body.emailNotificationFrequency
                },
                pushNotification:{
                    enabled: body.pushNotificationEnabled,
                    notificationType: body.pushNotificationType,
                    notificationFrequency: body.pushNotificationFrequency
                },
                },
                role: body.role.toString().toLowerCase().trim(),
                ...bodyCopy,
            
        }
}



module.exports = {
    registerBodyTransformer,
    completeRegisterBodyTransformer,
}