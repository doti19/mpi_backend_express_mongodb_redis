const jwt = require("jsonwebtoken");

const redisClient = require("../../config/redis");
const { jwt_token, token: tokenConfig } = require("../../config/config");
const logger = require("../../config/logger");

const {User:UserSchema, Token, UserToken, Invitation, UsersCourse, Course } = require("../models");

const User = UserSchema.User;
const Player = UserSchema.Player;
const Coach = UserSchema.Coach;
const Parent = UserSchema.Parent;

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
const UserCourses = require("../models/user.course.model");
const mongoose = require("mongoose");
const { addCoursesToPlayer } = require("../../helpers/course.helper");



const register = async (body, query) => {
    if(body.role && body.role==='admin'){
        const user = await User.findOne({role: 'admin'});
        if(!user){
            //TODO these should be saved on .env file
            body.isRegistrationComplete = false;
            body.role = 'admin';
            body.emailAddress={email:"saminassaminas@gmail.com", verified: true};
            body.password = "asdfasdff";
            body.firstName = "MPI";
            body.lastName = "Adminstrator";
            body.phoneNumber ={
                countryCode: 'ET',
                number: '1234567890',
            };
            
            const result = await registerUser(body, User);
            return result;
        }
    }
    try {
        authJoiValidator.registerBodyValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    
    const {rel, token} = query;
    console.log("inside the register service");
    console.log("rel", rel);
    // when i say role, i mean the user to be created
    //if rel is child, then role should player
    //if rel is player, then role should be coach
    //if rel is coach, then role should be player
    //if rel is parent, then role should be parent

    const transformedBody = authTransformer.registerBodyTransformer(body);
    if(token){

        if(rel=="child") transformedBody.role="player";
        else if(rel=="player") transformedBody.role="coach";
        else if(rel=="coach") transformedBody.role="player";
        else if(rel=="parent") transformedBody.role="parent";
    }
    const Model = modelTransformer.convertModel(transformedBody.role);

    if((rel=='parent'||rel=='child'||rel=='coach'||rel=='player')&&token){
        const invitation = await Invitation.findOne({token: token, rel: rel, createdAt: { $gt: Date.now() - tokenConfig.invitationExpirationSeconds * 1000 },});
        console.log('invitation', invitation)
        if(!invitation){
            console.log('no invitation found')
            const result = await registerUser(transformedBody, Model);
            return result;
        }
        if(invitation.rel !==rel || invitation.invitedEmail !== transformedBody.emailAddress.email){
           
            const result = await registerUser(transformedBody, Model);
            return result;
        }
    
        if(rel=='parent'){
            console.log('inside the parent')
            const child = await Player.findById(invitation.inviterId);
            if(!child || child.parents.length>=2){
                console.log('no child found')
                const result = await registerUser(transformedBody, Model);
                return result;
            }
            transformedBody.children= [child._id];
            const result = await registerUser(transformedBody, Parent);
            if(result.status==201){
                consol.log('inside the parent successfull registration')
                child.parents.push(result.user.id);
                await child.save();
                await invitation.deleteOne();
                return result;
            }else{
                console.log('inside the parent error registration')
                await Parent.findByIdAndUpadate(result.user.id, {$pull: {children: child.id}});
                await child.parents.pull(result.user.id);
                await child.save();
                throw new APIError({message: "Error registering User", status: 501});
            }

        }else if(rel=='child'){
            console.log('inside the child')
            const parent = await Parent.findById(invitation.inviterId);
            if(!parent){
                console.log('no parent found')
                const result = await registerUser(transformedBody, Model);
                return result;
            }
            transformedBody.parents= [parent.id];
            const result = await registerUser(transformedBody, Player);
            if(result.status==201){
                console.log('inside the child successfull registration')
                parent.children.push(result.user.id);
                await parent.save();
                await invitation.deleteOne();
                console.log('kemakis men alo');
                return result;
            }else{
                console.log('inside the child error registration')
                await Player.findByIdAndUpadate(result.user.id, {$pull: {parents: parent.id}});
                await parent.children.pull(result.user.id);
                await parent.save();
                throw new APIError({message: "Error registering User", status: 501});
            }

        }else if(rel=='coach'){
            console.log('inside the coach')
            const player = await Player.findById(invitation.inviterId);
            if(!player){
                console.log('no player found')
                const result = await registerUser(transformedBody, Model);
                return result;
            }
            transformedBody.players= [player.id];
            const result = await registerUser(transformedBody, Coach);
            if(result.status==201){
                console.log('inside the coach successfull registration')    
                player.coaches.push(result.user.id);
                await player.save();
                await invitation.deleteOne();
                return result;
            }else{
                console.log('inside the coach error registration')
                await Coach.findByIdAndUpadate(result.user.id, {$pull: {players: player.id}});
                await player.coaches.pull(result.user.id);
                await player.save();
                throw new APIError({message: "Error registering User", status: 501});
            }

        }else if(rel=='player'){
            console.log('inside the player')
            const coach = await Coach.findById(invitation.inviterId);
            if(!coach){
                console.log('no coach found')
                const result = await registerUser(transformedBody, Model);
                return result;
            }
            transformedBody.coaches= [coach.id];
            const result = await registerUser(transformedBody, Player);
            if(result.status==201){
                console.log('inside the player successfull registration')
                coach.players.push(result.user.id);
                await coach.save();
                await invitation.deleteOne();
                return result;
            }else{
                console.log('inside the player error registration')
                await Player.findByIdAndUpadate(result.user.id, {$pull: {coaches: coach.id}});
                await coach.players.pull(result.user.id);
                await coach.save();
                throw new APIError({message: "Error registering User", status: 501});
            }
        }else{
            const result = await registerUser(transformedBody, Model);
            return result;
        }
    } else{
        const result = await registerUser(transformedBody, Model);
        return result;
    }
};

async function registerUser (transformedBody, Model){
    try {
        const existingUser = await User.findOne({
            "emailAddress.email": transformedBody.emailAddress.email,
        });

        if (existingUser) {
            return { message: "Email is in Use", status: 422 };
        }

        const newUser = Model(transformedBody);
        // const session = await mongoose.startSession();
        // session.startTransaction();
        const res = await newUser.registerUser(newUser);
        if(transformedBody.role==='player'){
            try{
                await addCoursesToPlayer(newUser._id);
                // await session.commitTransaction();
            }catch(err){
                // await session.abortTransaction();
                if(res){
                    await User.deleteOne({_id: res.id});
                }
                console.log(err);
                throw new APIError({message: "Error registering User", status: 501});
            }finally{
                // session.endSession();
            
            }
        }
        return { message: "Registered Successfully", status: 201, user: res };
    } catch (err) {
        throw new APIError({
            message: "Error registering User",
            status: 501,
            stack: err.stack,
        });
    }
}



const completeRegistration = async(body, user)=>{
    try {
        authJoiValidator.completeRegistrationValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    
    const transformedBody = authTransformer.completeRegisterBodyTransformer(body);
    console.log(transformedBody);
    const Model = modelTransformer.convertModel(transformedBody.role);
    const exsitingUser = await User.findById(user.id);
    if(!exsitingUser){
        throw new APIError({message: "User not found", status: 404});
    }
    if(exsitingUser.isRegistrationComplete){
        throw new APIError({message: "User already completed registration", status: 409});
    }
    let updatedUser;
    try{
//TODO i am deleting a user, u need to carefully analyze this later, when you have time
        transformedBody.isRegistrationComplete = true;
        const res = new Model({...exsitingUser.toObject(), ...transformedBody});
        console.log('res', res);
        const hashed = await User.hashPassword(transformedBody.password);
        transformedBody.password = hashed;
        // transformedBody._id = user.id;
        await User.deleteOne({_id: user.id})
        console.log('deleted');
        const  updatedUser =await res.registerUser(res);
         return {status: 201, message: 'Registered Successfully' ,user:updatedUser};
    }catch(err){
        console.log(err);
        throw new APIError({message: "Error completing registration", status: 501});
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
    completeRegistration,
    changePassword,
    logout,
    refresh,
};
