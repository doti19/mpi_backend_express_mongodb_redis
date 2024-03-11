const userUpdateBodyTransformer = (body) => {
    const bodyCopy = { ...body };
    delete bodyCopy.email;
    delete bodyCopy.password;
    delete bodyCopy.phoneNumber;
    delete bodyCopy.phoneNumberCountryCode;
    delete bodyCopy.streetAddress;
    delete bodyCopy.streetAddress2;
    delete bodyCopy.city;
    delete bodyCopy.stateProvince;
    delete bodyCopy.country;
    delete bodyCopy.zipCode;
    delete bodyCopy.emailNotificationEnabled;
    delete bodyCopy.emailNotificationType;
    delete bodyCopy.emailNotificationFrequency;
    delete bodyCopy.pushNotificationEnabled;
    delete bodyCopy.pushNotificationType;
    delete bodyCopy.pushNotificationFrequency;
    delete bodyCopy.role;
    delete bodyCopy.provider;
    if (body.email) bodyCopy.emailAddress.email = body.email;

    if (body.phoneNumber)
        bodyCopy.phoneNumber
            ? (bodyCopy.phoneNumber.number = body.phoneNumber)
            : (bodyCopy.phoneNumber = { number: body.phoneNumber });
    if (body.phoneNumberCountryCode)
        bodyCopy.phoneNumber
            ? (bodyCopy.phoneNumber.countryCode = body.phoneNumberCountryCode)
            : (bodyCopy.phoneNumber = { countryCode: phoneNumberCountryCode });

    if (body.streetAddress)
        bodyCopy.address
            ? (bodyCopy.address.streetAddress = body.streetAddress)
            : (bodyCopy.address = { streetAddress: body.streetAddress });
    if (body.streetAddress2)
        bodyCopy.address
            ? (bodyCopy.address.streetAddress2 = body.streetAddress2)
            : (bodyCopy.address = { streetAddress2: body.streetAddress2 });
    if (body.city)
        bodyCopy.address
            ? (bodyCopy.address.city = body.city)
            : (bodyCopy.address = { city: body.city });
    if (body.stateProvince)
        bodyCopy.address
            ? (bodyCopy.address.stateProvince = body.stateProvince)
            : (bodyCopy.address = { stateProvince: body.stateProvince });
    if (body.country)
        bodyCopy.address
            ? (bodyCopy.address.country = body.country)
            : (bodyCopy.address = { country: body.country });
    if (body.zipCode)
        bodyCopy.address
            ? (bodyCopy.address.zipCode = body.zipCode)
            : (bodyCopy.address = { zipCode: body.zipCode });

    if (body.emailNotificationEnabled)
        bodyCopy.notificationPreference? (bodyCopy.notificationPreference.emailNotification?(bodyCopy.notificationPreference.emailNotification.enabled =
            body.emailNotificationEnabled): (bodyCopy.notificationPreference.emailNotification = {enabled: body.emailNotificationEnabled}))
            :
            (bodyCopy.notificationPreference = {emailNotification:{enabled: body.emailNotificationEnabled}})
    
        
    if (body.emailNotificationType)
    bodyCopy.notificationPreference? (bodyCopy.notificationPreference.emailNotification?(bodyCopy.notificationPreference.emailNotification.notificationType =
        body.emailNotificationType): (bodyCopy.notificationPreference.emailNotification = {notificationType: body.emailNotificationType}))
        :
        (bodyCopy.notificationPreference = {emailNotification:{notificationType: body.emailNotificationType}})
        
    if (body.emailNotificationFrequency)
    bodyCopy.notificationPreference? (bodyCopy.notificationPreference.emailNotification?(bodyCopy.notificationPreference.emailNotification.notificationFrequency =
        body.emailNotificationFrequency): (bodyCopy.notificationPreference.emailNotification = {notificationFrequency: body.emailNotificationFrequency}))
        :
        (bodyCopy.notificationPreference = {emailNotification:{notificationFrequency: body.emailNotificationFrequency}})
    
    
    if (body.pushNotificationEnabled)
        bodyCopy.notificationPreference? (bodyCopy.notificationPreference.pushNotification?(bodyCopy.notificationPreference.pushNotification.enabled =
            body.pushNotificationEnabled): (bodyCopy.notificationPreference.pushNotification={enabled: body.pushNotificationEnabled}))
            :
            (bodyCopy.notificationPreference = {pushNotification:{enabled: body.pushNotificationEnabled}})

    if (body.pushNotificationType)
    bodyCopy.notificationPreference? (bodyCopy.notificationPreference.pushNotification?(bodyCopy.notificationPreference.pushNotification.notificationType =
        body.pushNotificationType): (bodyCopy.notificationPreference.pushNotification={notificationType: body.pushNotificationType}))
        :
        (bodyCopy.notificationPreference = {pushNotification:{notificationType: body.pushNotificationType}})

    if (body.pushNotificationFrequency)
    bodyCopy.notificationPreference? (bodyCopy.notificationPreference.pushNotification?(bodyCopy.notificationPreference.pushNotification.notificationFrequency =
        body.pushNotificationFrequency): (bodyCopy.notificationPreference.pushNotification={notificationFrequency: body.pushNotificationFrequency}))
        :
        (bodyCopy.notificationPreference = {pushNotification:{notificationFrequency: body.pushNotificationFrequency}})

    // if(body.role) role = body.role.toString().toLowerCase().trim()
    
    result =dotify(bodyCopy);
    console.log(result);
    return result;
};

module.exports = {
    userUpdateBodyTransformer,
};


function dotify(obj) {

    const res = {};
  
    function recurse(obj, current) {
      for (const key in obj) {
        const value = obj[key];
        const newKey = (current ? current + '.' + key : key);
        //skip if value is an array
        //TODO find out if it similar with  Date types too: i havent got error, but here is the code
        //&& !(value instanceof Date)
        if (value && typeof value === 'object' && !Array.isArray(value) ){
          recurse(value, newKey);
        } else {
          res[newKey] = value;
        }
      }
    }
  
    recurse(obj);
    return res;
  }