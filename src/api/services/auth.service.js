const jwt = require("jsonwebtoken");

const redisClient = require("../../config/redis");
const { jwt_token, token: tokenConfig } = require("../../config/config");
const logger = require("../../config/logger");

const { Token, UserToken } = require("../models");
const { User } = require("../models").User;
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { bcrypt: bcryptConfig, links, server } = require("../../config/config");
const sendEmail = require("../../config/email");
const httpStatus = require("http-status");
const { APIError } = require("../../errors/apiError");
const { authJoiValidator } = require("../../validators");
const { authTransformer, modelTransformer } = require("../../transformers");
const { verifyRefreshToken } = require("../../helpers/jwt.helper");

const { checkError } = require("../../utils/checkError");
const register = async (body) => {
    try {
        authJoiValidator.registerBodyValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    const transformedBody = authTransformer.registerBodyTransformer(body);
    const Model = modelTransformer.convertModel(transformedBody.role);

    try {
        const existingUser = await User.findOne({
            "emailAddress.email": transformedBody.emailAddress.email,
        });

        if (existingUser) {
            return { message: "Email is in Use", status: 422 };
        }

        const newUser = Model(transformedBody);
        const res = await newUser.registerUser(newUser);
        return { message: "Registered Successfully", status: 201, user: res };
    } catch (err) {
        throw new APIError({
            message: "Error registering User",
            status: 501,
            stack: err.stack,
        });
    }
};

const login = async (req) => {
    try {
        console.log("inside the login service");
        const token = checkError(await req.user.generateJWT());
        const user = checkError(req.user.toJSON());

        return { user, tokens: token };
    } catch (err) {
        throw new Error("Error logging in", err);
    }
};

const changePassword = async (body, id) => {
    try {
        authJoiValidator.changePasswordValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    const user = await User.findOne({ _id: id });
    const { oldPassword, newPassword } = body;
    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) {
        throw new Error("Current password is incorrect");
    }

    const hashed = await User.hashPassword(newPassword);
    user.password = hashed;
    user.passwordChangedAt = Date.now();
    await user.save();
    return { message: "password changed successfully" };
};
const requestPasswordReset = async (body) => {
    try {
        authJoiValidator.requestPasswordResetValidator(body);
    } catch (err) {
        //TODO for all errors related to validation, please have them in one place
        throw new APIError(err);
    }

    const user = await User.findOne({ "emailAddress.email": body.email });

    if (!user)
        throw new APIError({
            status: httpStatus.NOT_FOUND,
            message: "No user found with this email",
        });

    const token = await Token.findOne({ userId: user._id });

    if (token) await Token.deleteOne();

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = await bcrypt.hash(resetToken, bcryptConfig.saltRounds);

    await new Token({
        userId: user._id,
        userEmail: user.emailAddress.email,
        token: hash,
        createdAt: Date.now(),
    }).save();

    const link = `${links.baseUrl}${links.resetPassword}/${resetToken}?email=${user.emailAddress.email}`;
    checkError(
        sendEmail({
            email: user.emailAddress.email,
            subject: "Password Reset Request",
            payload: {
                name: user.firstName,
                link: link,
            },
            template: "requestResetPassword.handlebars",
        })
    );
    //TODO: use this for development only
    if (server.env !== "production") {
        return { link: link, token: resetToken, email: user.emailAddress.email };
    } else {
        return { message: "Password reset link sent to your email" };
    }
};

const resetPassword = async (body, params, query) => {
    const data = {
        ...body,
        ...params,
        ...query,
    };
    try {
        authJoiValidator.resetPasswordValidator(data);
    } catch (err) {
        throw new Error(err);
    }
    const { token, email, password } = data;
    let passwordResetToken = await Token.findOne({
        userEmail: email,
        createdAt: { $gt: Date.now() - tokenConfig.expiresIn * 1000 },
    });

    if (!passwordResetToken) {
        throw new Error("Invalid or expired reset token");
    }

    const isValid = await bcrypt.compare(token, passwordResetToken.token);
    if (!isValid) {
        throw new Error("Invalid or expired password reset token");
    }

    bcrypt.genSalt(bcryptConfig.saltRounds, (err, salt) => {
        if (err) {
            throw new Error("Failed to Authenticate", err);
        }

        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) {
                throw new Error("Failed to Authenticate", err);
            }

            await User.updateOne(
                { _id: passwordResetToken.userId },
                {
                    password: hash,
                    paswordChangedAt: Date.now(),
                }
            );
        });
    });
    const user = await User.findOne({ _id: passwordResetToken.userId });
    sendEmail({
        email: user.emailAddress.email,
        subject: "Password Reset Successfully",
        payload: {
            name: user.firstName,
        },
        template: "resetPassword.handlebars",
    });
    await passwordResetToken.deleteOne();
    return { message: "password reset was successful" };
};

const logout = async (req) => {
    try {
        authJoiValidator.refreshTokenBodyValidator(req.body);
    } catch (err) {
        throw new Error(err);
    }

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (userToken) {
        await userToken.deleteOne();
    }
    const accessToken = req.headers.authorization.split(" ").pop();
    const accessTokenPayload = jwt.verify(accessToken, jwt_token.access.secret);

    const currentTime = Math.floor(Date.now() / 1000);
    const accessTokenLife = currentTime - accessTokenPayload.iat;

    const userId = req.user._id;

    try {
        await redisClient.set(`${userId}`, `${accessToken}`, {
            EX: accessTokenLife,
        });

        //TODO think about when the redis client is down, you need to handle such kinds of scenarios, how do you handle jwt????
    } catch (err) {
        logger.error(`Error setting token in redis: ${err}`);
    }
    return { message: "user logged out succesfully" };
};

const refresh = async (body) => {
    try {
        authJoiValidator.refreshTokenBodyValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    const result = await verifyRefreshToken(body.refreshToken);
    if (result.error == true) {
        throw new Error(result.message);
    }
    const user = await User.findOne({ _id: result.token.userId });
    const tokens = await user.generateJWT();
    return { tokens: tokens };
};

module.exports = {
    requestPasswordReset,
    resetPassword,
    login,
    register,
    changePassword,
    logout,
    refresh,
};
