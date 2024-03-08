const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const fs = require('fs')
const { join } = require('path')
const uniqueValidator = require('mongoose-unique-validator')

const { IMAGES_FOLDER_PATH } = require('../../utils/constants')
const { isValidUrl } = require('../../utils/isValid')
const { jwt_token, bcrypt: bcryptConfig } = require('../../config/config')
const UserToken = require('./user.token.model');

const emailSchema = mongoose.Schema({
    email: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, 'Please provide a valid email'],
    },
   
    verified: {
        type: Boolean,
        required: [true, 'Please verify your email address'],
        //TODO if service is google, this should be true by default
        default: false,
    },
}, {_id: false,});

const addressSchema = mongoose.Schema({
    streetAddress: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
        //TODO is there a minimum and maximum for street address
    },
    streetAddress2:{
        type: String,
        required: false,
    },
    city: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    stateProvince: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    country: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50
    },
    zipCode: {
        type: String,
        // required: true,
        minLength: 3,
        maxLength: 50
    },
},{_id: false});
const phoneNumberSchema = mongoose.Schema({
    countryCode: {
        type: String,
        required: [true, "Please enter your country code"],
        pattern: /^[A-Z]{2}/
    },
    number: {
        type: String,
        required: [true, "Please enter your phone number"],
        minLength: 7,
        maxLength: 15,
        pattern: /^[0-9]+/

    },
}, {_id: false});



const userSchema = mongoose.Schema(
    {
        //TODO for those required=true, please add a message too
        firstName: {
            type: String,
            required: [true, 'Please enter your firstName'],
            trim: true,
        },
        lastName: {
            type: String,
            default: '',
            trim: true,
        },
        emailAddress: emailSchema,
        password: {
            type: String,
            maxLength: 60,
            trim: true,
            //you cant select false, as it is needed by bcrypt
            // select: false,
            //dont change it to make it more strong
            //TODO if service is google, this should be null by default
            //TODO if service is local, this should be required
            //TODO make it more strong
        },
        dateOfBirth:{
            type: Date,
            required: [true, 'Please enter your date of birth'],
            //TODO make sure the date is not in the future
            //TODO make sure the date is not in the past 100 years
        },
        gender:{
            type: String,
            required: [true, 'Please enter gender'],
            enum:['male', 'female', 'other']
        },
        phoneNumber:phoneNumberSchema,
        
        address:addressSchema,
        tennisRanking:{
            type: String,
            //TODO connect to external api later
            // required: true,
            default: 'beginner',
            enum: ['beginner', 'intermediate', 'advanced', 'professional']
        },
        isProfilePublic:{
            type: Boolean,
            // required: true,
            default: true,

        },
        notificationPreference:{
            type: Object,
            required: true,
            default: {
                emailNotification: {
                    enabled: true,
                    notificationType: ['newMatch', "friendActivity"],
                    notificationFrequency: 'daily'
                },
                pushNotification: {
                    enabled: true,
                    notificationType: ['newMatch', 'matchReminder', 'matchResult', "friendActivity", "homework"],
                    notificationFrequency: 'daily'
                }
            },
            emailNotification: {
                type: Object,
                required: true,
                enabled: {
                type: Boolean,
                required: true,
                default: true,
                },
                notificationType:{
                    type: Array,
                    required: true,
                    enum: ['newMatch', 'matchReminder', 'matchResult', "friendActivity"],
                    default: ['friendActivity', 'newMatch']
                },
                notificationFrequency:{
                    type: String,
                    required: true,
                    default: 'daily',
                    enum: ['daily', 'weekly', 'monthly']
                }
            },
            pushNotification:{
                type: Object,
                required: true,
                enabled: {
                    type: Boolean,
                    required: true,
                    default: true,
                },
                notificationType:{
                    type: Array,
                    required: true,
                    enum: ['newMatch', 'matchReminder', 'matchResult', "friendActivity", "homework"],
                    default: ['newMatch', 'matchReminder', 'matchResult', "friendActivity", 'homeWork'] 
                },
                notificationFrequency:{
                    type: String,
                    required: true,
                    default: 'daily',
                    enum: ['daily', 'weekly', 'monthly']
                }
            }
        },
        avatar: {
            type: String,
            //TODO make sure this one is changed to a default picture from public/images
            default: '',
        },
        
        role: {
            type: String,
            default: 'user',
            enum: ['user', 'admin'],
        },
        googleId: {
            type: String,
            unique: true,
            sparse: true,
        },
        isOnline: {
            type: Boolean,
            default: true,
            select: false,
        },
        lastOnline:{
            type: Date,
            default: Date.now,
        },
        provider: {
            type: String,
            default: 'local',
            required: true,
        },
        passwordChangedAt:{
            type: Date,
            select: false,
        }
    },
    {
        timestamp: true,
        versionKey: false,
        // toObj: {
        //     virtuals: true,
        // },
    }
)

userSchema.virtual('id').get(function () {
    return this._id.toHexString()
})

userSchema.virtual('fullName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim()
})

// userSchema.statics.encryptPassword = async function(password) {
//     const salt = await bcrypt.genSalt(10);
//     return await bcrypt.hash(password, salt);
// };

// userSchema.statics.comparePassword = async function(password, receivedPassword){
//     return await bcrypt.compare(password, receivedPassword);
// };

// userSchema.methods.isValidPassword = async function (password) {
//     return await bcrypt.compare(password, this.password);
// };

// userSchema.set('toJSON', {
//     virtuals: true,
//     transform: function(doc, ret) {
//         delete ret._id;
//         delete ret.password;
//     }
// });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next()
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if(this.passwordChangedAt){
        const passwordChangedTime = parseInt(this.passwordChangedAt.getTime() / 1000);
        return JWTTimestamp < passwordChangedTime;
    }
}

// console.log(join(__dirname, '..', '..', '..', IMAGES_FOLDER_PATH))
userSchema.methods.toJSON = function () {
    // if not exists avatar1 default
    const absoluteAvatarFilePath = `${join(__dirname, '..', '..', '..', IMAGES_FOLDER_PATH)}${this.avatar}`
    //TODO is this needed
    const avatar = isValidUrl(this.avatar)
        ? this.avatar
        : fs.existsSync(absoluteAvatarFilePath)
            ? `${IMAGES_FOLDER_PATH}${this.avatar}`
            : `${IMAGES_FOLDER_PATH}avatar1.jpg`
    // return {
    //     id: this._id,
    //     provider: this.provider,
    //     firstName: this.firstName,
    //     lastName: this.lastName,
    //     emailAddress: this.emailAddress,
    //     dateOfBirth: this.dateOfBirth,
    //     gender: this.gender,

    //     avatar: avatar,
    //     role: this.role,
    //     createdAt: this.createdAt,
    //     updatedAt: this.updatedAt,
    // }
    const user = this.toObject();
    
    user.avatar = avatar;
    user.id = this._id;
    delete user.password;
    delete user.passwordChangedAt;
    delete user._id;
    delete user.__v;
    return user;
}

userSchema.methods.generateJWT = async function () {
    // try{
   const payload = {
        id: this._id,
        email: this.emailAddress.email,
        provider: this.provider,
        role: this.role
    };
    const access_token = jwt.sign(
        payload,
        jwt_token.access.secret,
        {
            expiresIn: jwt_token.access.expiresIn,
        },
    );

    const refreshToken = jwt.sign(
        payload,
        jwt_token.refresh.secret,
        {
            expiresIn: jwt_token.refresh.expiresIn,
        },
    );
const userToken = await UserToken.findOne({
    userId: this._id,
});
if (userToken) {
    await UserToken.deleteOne({ userId: this._id });
}
await new UserToken({
    userId: this._id, token: refreshToken
}).save();
    return {accessToken: access_token, refreshToken: refreshToken};
// }catch(err){
//     // throw new Error(err);
//     throw new Error(err);
// }
}

userSchema.methods.registerUser = async(newUser) => {
        // bcrypt.genSalt(bcryptConfig.saltRounds).then(salt => {
        //     bcrypt.hash(newUser.password, salt).then(hash => {
        //     newUser.password = hash;
        //     throw new Error();
        //     newUser.save().then(res => {
        //         // Handle successful save
        //         console.log('user saved successfully');
        //     }).catch(saveError => {
        //         // Handle save error
        //         console.log('user is not saved');
        //         return new Error(saveError);

        //     });
        //     }).catch(hashError => {
        //     // Handle hash error
        //     console.log('error with hashing password');
        //     return new Error(hashError);
        //     });
        // }).catch(saltError => {
        //     console.log('error with generating salt');
        //     return new Error(saltError);
        //     // Handle salt error
        // });
        
            const salt = await bcrypt.genSalt(bcryptConfig.saltRounds);
            const hash = await bcrypt.hash(newUser.password, salt);
            newUser.password = hash;
            throw new Error();
            await newUser.save();
        // } catch(err){
        //     throw new Error(err);
        // }  

    }
// userSchema.methods.registerUser = async(newUser, callback) => {
//     bcrypt.genSalt(bcryptConfig.saltRounds, (err, salt) => {
//         if (err) {
//             return callback(err, null);
//         }
//         bcrypt.hash(newUser.password, salt, async (hashError, hash) => {
//             if (hashError) {
//                 return callback(hashError, null);
//             }
//             newUser.password = hash;
//             try{
//                 throw new Error();
//                res = await newUser.save();
               
//                 return callback(null, res);
//             }catch(saveError){
//                 console.log('dootiiii', saveError);
//                return callback(saveError, null);
//             }
//         })
//     })
// }

userSchema.methods.comparePassword = function (password, callback) {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) {
            return callback(err)
        }
        callback(null, isMatch)
    })
}

const hashPassword = async password => {
    bcrypt.genSalt(bcryptConfig.saltRounds, (err, salt) => {
        if (err) {
            throw new Error(err)
        }
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                throw new Error(err)
            }
            return hash
        })
    })
}
exports.hashPassword = hashPassword


userSchema.plugin(uniqueValidator, {
    type: 'mongoose-unique-validator',
    message:
        'Error, expected {PATH} to be unique. Value: {VALUE} is already taken.',
})
const User = mongoose.model('User', userSchema)

module.exports = User;
