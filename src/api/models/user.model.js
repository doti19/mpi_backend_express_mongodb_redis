const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { join } = require("path");
const uniqueValidator = require("mongoose-unique-validator");

const { IMAGES_FOLDER_PATH } = require("../../utils/constants");
const { isValidUrl } = require("../../utils/isValid");
const {
    jwt_token,
    bcrypt: bcryptConfig,
    token: tokenConfig,
} = require("../../config/config");
const UserToken = require("./user.token.model");

const emailSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            validate: [validator.isEmail, "Please provide a valid email"],
        },

        verified: {
            type: Boolean,
            required: [true, "Please verify your email address"],
            //TODO if service is google, this should be true by default
            default: false,
        },
    },
    { _id: false }
);

const addressSchema = mongoose.Schema(
    {
        streetAddress: {
            type: String,
            required: [true,"please enter street Address" ],
            minLength: 3,
            maxLength: 50,
            //TODO is there a minimum and maximum for street address
        },
        streetAddress2: {
            type: String,
            required: false,
        },
        city: {
            type: String,
            required: [true, "please enter city"],
            minLength: 3,
            maxLength: 50,
        },
        stateProvince: {
            type: String,
            required: [true, "please enter state/province"],
            minLength: 3,
            maxLength: 50,
        },
        country: {
            type: String,
            required: [true, "please enter country" ],
            minLength: 3,
            maxLength: 50,
        },
        zipCode: {
            type: String,
            // required: true,
            minLength: 3,
            maxLength: 50,
        },
    },
    { _id: false }
);
const phoneNumberSchema = mongoose.Schema(
    {
        countryCode: {
            type: String,
            required: [true, "Please enter your country code"],
            pattern: /^[A-Z]{2}/,
        },
        number: {
            type: String,
            required: [true, "Please enter your phone number"],
            minLength: 7,
            maxLength: 15,
            pattern: /^[0-9]+/,
        },
    },
    { _id: false }
);
const emailNotificationSchema = mongoose.Schema(
    {
        enabled: {
            type: Boolean,
            required: [true, "Please enable email notification"],
            default: true,
        },
        notificationType: {
            type: [String],
            required: [true, "Please select notification type"],

            enum: ["newMatch", "matchReminder", "matchResult", "friendActivity"],
            default: ["friendActivity", "newMatch"],
        },
        notificationFrequency: {
            type: String,
            required: [true, "Please select notification frequency"],
            default: "daily",
            enum: ["daily", "weekly", "monthly"],
        },
    },
    { _id: false }
);

const pushNotificationSchema = mongoose.Schema(
    {
        enabled: {
            type: Boolean,
            required: [true, "Please enable push notification"],
            default: true,
        },
        notificationType: {
            type: [String],
            required: [true, "Please select notification type"],

            enum: [
                "newMatch",
                "matchReminder",
                "matchResult",
                "friendActivity",
                "homeWork",
            ],
            default: [
                "newMatch",
                "matchReminder",
                "matchResult",
                "friendActivity",
                "homeWork",
            ],
        },
        notificationFrequency: {
            type: String,
            required: [true, "Please select notification frequency"],
            default: "daily",
            enum: ["daily", "weekly", "monthly"],
        },
    },
    { _id: false }
);
const notificationPreferenceSchema = mongoose.Schema(
    {
        emailNotification: {
            type: emailNotificationSchema,
            required: [true, "Please select email notification preference"],
        },
        pushNotification: {
            type: pushNotificationSchema,
            required: [true, "Please select push notification preference"],
        },
    },
    { _id: false }
);
const options = { discriminatorKey: "userType" };

const userSchema = mongoose.Schema(
    {
        isRegistrationComplete:{
            type: Boolean,
            default: false,
            
        },
        //TODO for those required=true, please add a message too
        firstName: {
            type: String,
            required: [function() { return this.isRegistrationComplete; }, "Please enter your firstName"],
            trim: true,
        },
        lastName: {
            type: String,
            default: "",
            trim: true,
        },
        emailAddress: emailSchema,
        password: {
            type: String,
            maxLength: 60,
            trim: true,
            required: [function() { return this.isRegistrationComplete; }, "Please enter your passwod"]
            //you cant select false, as it is needed by bcrypt
            // select: false,
            //dont change it to make it more strong
            //TODO if service is google, this should be null by default
            //TODO if service is local, this should be required
            //TODO make it more strong
        },
        dateOfBirth: {
            type: Date,
            required: [function() { return this.isRegistrationComplete; }, "Please enter your date of birth"],
            //TODO make sure the date is not in the future
            //TODO make sure the date is not in the past 100 years
        },
        gender: {
            type: String,
            required: [function() { return this.isRegistrationComplete; }, "Please enter gender"],
            enum: ["male", "female", "other"],
        },
        phoneNumber: phoneNumberSchema,

        address: addressSchema,
        // tennisRanking:{
        //     type: String,
        //     //TODO connect to external api later
        //     // required: true,
        //     default: 'beginner',
        //     enum: ['beginner', 'intermediate', 'advanced', 'professional']
        // },
        isProfilePublic: {
            type: Boolean,
            // required: true,
            default: true,
        },
        notificationPreference: {
            type: notificationPreferenceSchema,
            //    required: true,
            //    default: {
            //     emailNotification: {
            //         enabled: true,
            //         notificationType: [ "friendActivity"],
            //         notificationFrequency: 'daily'
            //     },
            //     pushNotification: {
            //         enabled: true,
            //         notificationType: ['newMatch', 'matchReminder', 'matchResult', "friendActivity", "homeWork"],
            //         notificationFrequency: 'daily'
            //     }
            // },
        },
        avatar: {
            type: String,
            //TODO make sure this one is changed to a default picture from public/images
            default: "",
        },

        role: {
            type: String,
            // default: 'user',
            required: [function() { return this.isRegistrationComplete; }, "Please enter your role"],
            enum: ["player", "coach", "parent", "admin"],
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
        lastOnline: {
            type: Date,
            default: Date.now,
        },
        provider: {
            type: String,
            default: "local",
            required: true,
        },
        passwordChangedAt: {
            type: Date,
            select: false,
        },
        active: {
            type: Boolean,
            default: true,
            select: false,
        },
        
    },
    {
        timestamp: true,
        versionKey: false,
        // toObj: {
        //     virtuals: true,
        // },
    },
    options
);

userSchema.virtual("id").get(function () {
    return this._id.toHexString();
});

userSchema.virtual("fullName").get(function () {
    return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password") || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const passwordChangedTime = parseInt(
            this.passwordChangedAt.getTime() / 1000
        );
        return JWTTimestamp < passwordChangedTime;
    }
};

userSchema.methods.toJSON = function () {
    // if not exists avatar1 default
    const absoluteAvatarFilePath = `${join(__dirname, "..", "..", "..", IMAGES_FOLDER_PATH)}${this.avatar}`;
    //TODO is this needed
    const avatar = isValidUrl(this.avatar)
        ? this.avatar
        : fs.existsSync(absoluteAvatarFilePath)
            ? `${IMAGES_FOLDER_PATH}${this.avatar}`
            : `${IMAGES_FOLDER_PATH}avatar1.jpg`;
    const user = this.toObject();

    user.avatar = avatar;
    user.id = this._id;
    delete user.password;
    delete user.passwordChangedAt;
    delete user._id;
    delete user.__v;
    return user;
};

userSchema.methods.generateJWT = async function () {
    const payload = {
        id: this._id,
        email: this.emailAddress.email,
        provider: this.provider,
        role: this.role,
    };
    const access_token = jwt.sign(payload, jwt_token.access.secret, {
        expiresIn: jwt_token.access.expiresIn,
    });

    const refreshToken = jwt.sign(payload, jwt_token.refresh.secret, {
        expiresIn: jwt_token.refresh.expiresIn,
    });
    const userToken = await UserToken.findOne({
        userId: this._id,
    });
    if (userToken) {
        await UserToken.deleteOne({ userId: this._id });
    }
    await new UserToken({
        userId: this._id,
        token: refreshToken,
    }).save();
    return { accessToken: access_token, refreshToken: refreshToken };
    //
};

userSchema.methods.registerUser = async (newUser) => {
    const salt = await bcrypt.genSalt(bcryptConfig.saltRounds);
    const hash = await bcrypt.hash(newUser.password, salt);
    newUser.password = hash;
    newUser.isRegistrationComplete = true;
    const user = await newUser.save();
    return user;
};

userSchema.methods.comparePassword = async function (password) {
    const isMatch = await bcrypt.compare(password, this.password);
    return isMatch;
};

const hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(bcryptConfig.saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

userSchema.methods.createResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, bcryptConfig.saltRounds);

    this.passwordResetToken = hash;

    console.log("resetToken:" + resetToken, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + tokenConfig.expiresIn * 1000;

    return resetToken;
};

userSchema.plugin(uniqueValidator, {
    type: "mongoose-unique-validator",
    message:
        "Error, expected {PATH} to be unique. Value: {VALUE} is already taken.",
});
const User = mongoose.model("User", userSchema);
User.hashPassword = hashPassword;

// Define the Player schema with specific fields
const Player = User.discriminator(
    "Player",
    new mongoose.Schema({
        tennisRanking: {
            type: String,
            //TODO connect to external api later
            // required: true,
            default: "beginner",
            enum: ["beginner", "intermediate", "advanced", "professional"],
        },
        // organization:[
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Organization",
        //         default: [],

        //     }
        // ],
        parents: {
            type:[{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Parent",
                default: [],
            }],
        validate: [parentLimit, '{PATH} exceeds the limit of 2']
    },
        coaches: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coach",
            default: [],
            // required: true,
        },
    ],
    })
);

// Define the Coach schema with specific fields
const Coach = User.discriminator(
    "Coach",
    new mongoose.Schema({
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player",
                // requierd: true,
                default: [],
            },
        ],
        // organization:[
        //     {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: "Organization",
        //         default: [],
        //     }
        // ]
    })
);

// Define the Parent schema with specific fields
const Parent = User.discriminator(
    "Parent",
    new mongoose.Schema({
        children: [
            {
                type: mongoose.Schema.Types.ObjectId,
                // required: true,
                default: [],
                ref: "Player",
            },
        ],
    })
);

function parentLimit(val) {
    return val.length <= 2;
  }
module.exports = { Player, Coach, Parent, User };
