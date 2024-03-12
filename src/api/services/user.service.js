const { User: UserSchema, Invitation } = require("../models");
const User = UserSchema.User;
const Parent = UserSchema.Parent;
const Player = UserSchema.Player;
const Coach = UserSchema.Coach;
const { APIError } = require("../../errors/apiError");
const { userTransformer } = require("../../transformers");
const { userJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");

const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { bcrypt: bcryptConfig, links, server, token: tokenConfig } = require("../../config/config");

const sendEmail = require("../../config/email");

const { checkError } = require("../../utils/checkError");

const updateProfile = async (user, body) => {
    try {
        userJoiValidator.updateProfileValidator(body);
    } catch (err) {
        throw new Error(err);
    }
    const transformedBody = userTransformer.userUpdateBodyTransformer(body);

    try {
        const updatedUser = await User.findByIdAndUpdate(
            {
                _id: user._id,
            },
            transformedBody,
            { new: true }
        );
        return updatedUser;
    } catch (err) {
        throw new Error(err);
    }
};

const deleteProfile = async (user) => {
    try {
        const deletedUser = await User.findByIdAndDelete({ _id: user._id });
        return { message: "User deleted successfully" };
    } catch (err) {
        throw new APIError({
            message: "Error deleting User",
            status: 501,
            stack: err.stack,
        });
    }
};

const searchUsers = async (query) => {
    // try{
    //     userJoiValidator.searchUserValidator(query);
    // }catch(err){
    //     throw new Error(err);
    // }
    // const transformedQuery = userTransformer.searchUserQueryTransformer(query);
    try {
        // const users = await User.find(transformedQuery);
        const apiFeatures = new APIFeatures(User.find(), query).search();
        const users = await apiFeatures.query;
        return { result: users.length, users };
    } catch (err) {
        throw new APIError({
            message: "Error searching for User",
            status: 501,
            stack: err.stack,
        });
    }
};

const inviteUser = async(body, user)=>{
    try{
            userJoiValidator.inviteUserValidator(body);
        }catch(err){
            throw new Error(err);
        }
        const {email, relationship} = body;
        try{
            // const Model = modelTransformer.convertModel(user.role);
            let message = '';
            let link = '';
    if(relationship=='parent' || relationship=='coach' || relationship=='child' || relationship=='player'){

    
        //const if the user is a player
        if(user.role=='player' ){
            // the player is adding a parent
            //check if he has 2 parents
            // if not send the link
            // also send the coach a link too, if he wants to add a coach
            if(relationship=='parent'){
            if(user.parents.length==2){
                throw new Error("You cannot have more than 2 parents");
            }
            const parent = await Parent.findOne({"emailAddress.email": email});
            // if there is a parent, send the link to api/v1/users/add
            if(parent){

                message = `Hello ${parent.firstName} ${parent.lastName}, ${user.firstName} ${user.lastName} has invited you to be their parent and support through their journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=parent`;
            }else{
                //TODO, pronoun issue?
                message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to be their parent and support through their journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
                link = `${links.baseUrl}${links.signupUser}?rel=parent`;
            }
            // if there is no parent, send the link to auth/register

        } else if(relationship=='coach'){
            const coach = await Coach.findOne({"emailAddress.email": email});
            // if there is a coach, send the link to api/v1/users/add
            if(coach){
                message = `Hello ${coach.firstName} ${coach.lastName}, ${user.firstName} ${user.lastName} has invited you to be their coach and support through their journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=coach`;
        }else{
            message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to be their coach and support through their journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
            link = `${links.baseUrl}${links.signupUser}?rel=coach`;
        }
    }else{
        throw new Error("Invalid Relationship");
    }
    }
    // if the user is parent
    else if(user.role=='parent'){
        // check if the child has 2 parents
        // if not send the link
        if(relationship=='child'){
            const child = await Player.findOne({"emailAddress.email": email});
            if(child){

                if(child.parents.length==2){
                    throw new Error("The child already has 2 parents");
                }
                message = `Hello ${child.firstName} ${child.lastName}, ${user.firstName} ${user.lastName} has asked to become your guardian and support you in your journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=child`;
            }else{
                message = `Hello How Do You do, ${user.firstName} ${user.lastName} has asked to become your guardian and support you in your journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
                link = `${links.baseUrl}${links.signupUser}?rel=child`;
            }
        }
        else{
            throw new Error("Invalid Relationship");
        }
    }
    // if the user is coach
    else if(user.role=='coach'){
        // since we didnt enforce the number of players a coach can have
        // just send them the link
        if(relationship=='player'){
            const player = await Player.findOne({"emailAddress.email": email});
            if(player){
                message = `Hello ${player.firstName} ${player.lastName}, ${user.firstName} ${user.lastName} has invited you to be their player and support you through your journey.\n Please click the link below to accept the invitation.`
                link = `${links.baseUrl}${links.addUser}?rel=player`;
            }else{
                message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to be their player and support you through your journey. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
                link = `${links.baseUrl}${links.signupUser}?rel=player`;
            }
        }else{
            throw new Error("Invalid Relationship");
        
        }
    }else{
        throw new Error("Invalid Role");
    }
}else if (relationship=='join'){
    const user = await User.find({email: email});
    if(user){
        return {"message": "User already exists"};
    }
    message = `Hello How Do You do, ${user.firstName} ${user.lastName} has invited you to join the platform. Please click the link below to accept the invitation.\n please ignore this message, if you think this is a mistake.`
    link = `${links.baseUrl}${links.signupUser}?rel=join`;
}else{
    throw new Error("Invalid Relationship");
}
    if(message && link){
        if(relationship=='join'){
            checkError(sendEmail({
                email: email,
                subject: "Invitation to join MPI",
                payload: {
                    message: message,
                    name: user.firstName,
                    link: `${link}`,
                },
                template: "invitation.handlebars",
            }));
            if(server.env !== "production"){
                return {link: link, email: email, message: message};
            }else{
                return {"message": "Invitation link"};
            
            }
        }else if(relationship=='parent' || relationship=='coach' || relationship=='child' || relationship=='player'){

        
            const resetToken = crypto.randomBytes(32).toString("hex");
            // const hash = await bcrypt.hash(resetToken, bcryptConfig.saltRounds);
            await Invitation.deleteMany({invitedEmail: email, rel: relationship, inviterId: user.id});
        const invitation = new Invitation({
            inviterId: user.id,
            invitedEmail: email,
            rel: relationship,
            token: resetToken,
        });
        await invitation.save();
            checkError(sendEmail({
                email: email,
                subject:  `Invitation from ${user.firstName}`,
                payload: {
                    message: message,
                    name: user.firstName,
                    link: `${link}&token=${resetToken}`,
                },
                template: "invitation.handlebars",
            }));
            if(server.env !== "production"){
                return {link: `${link}&token=${resetToken}`, email: email, token: resetToken, message: message};
            }else{
                return {"message": "Invitation link"};
            
            }
        }else{
            throw new Error("Error sending Invitation link");
        }
        }else{
            throw new Error("Error sending Invitation link");
        }
    }catch(err){
            console.log(err);
            throw new APIError({
                message: "Error sending Invitation link",
                status: 501,
                stack: err.stack,
            });
        }
}

const addUser = async(query)=>{
    try{
        userJoiValidator.addUserValidator(query);
    }catch(err){
        throw new Error(err);
    }
    try{
    const {rel, token} = query;
    if(rel=='join' || (rel!=='parent' && rel!=='coach' && rel!=='child' && rel!=='player')){
        throw new Error("Invalid Relationship");
    };
        
        const invitation = await Invitation.findOne({token: token, rel: rel, createdAt: { $gt: Date.now() - tokenConfig.invitationExpirationSeconds * 1000 },});
        if(!invitation){
            throw new Error("Invalid or expired invitation token");
        }
        if(invitation.rel !==rel){
            throw new Error("Invalid invitation link");
        }
    // now i have a valid invitation token...
    
    // if the invited is a parent, and the inviter is a child
    // first check if the user
    if(rel=='parent'){
        const child = await Player.findById(invitation.inviterId);
        if(!child){
            throw new Error("Invalid invitation");
        }
        if(child.parents.length>=2){
            throw new Error("The child already has 2 parents");
        }
        const parent = await Parent.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!parent){
            throw new Error("Invalid invitation");
        }
        child.parents.push(parent.id);
        parent.children.push(child.id);
        await child.save();
        await parent.save();
        await invitation.deleteOne();
        
        return {message: "child added successfully"};

    }
    // if the invited is a player, and inviter is a coach
    else if(rel=='player'){
        const coach = await Coach.findById(invitation.inviterId);
        if(!coach){
            throw new Error("Invalid invitation");
        }
        const player = await Player.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!player){
            throw new Error("Invalid invitation");
        }
        coach.players.push(player.id);
        player.coaches.push(coach.id);
        await coach.save();
        await player.save();
        await invitation.deleteOne();
        return {message: "Coach added successfully"};
    }
    // if the invited is a coach, and inviter is a player
    else if(rel=='coach'){
        const player = await Player.findById(invitation.inviterId);
        if(!player){
            throw new Error("Invalid invitation");
        }
        const coach = await Coach.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!coach){
            throw new Error("Invalid invitation");
        }
        player.coaches.push(coach.id);
        coach.players.push(player.id);
        await player.save();
        await coach.save();
        await invitation.deleteOne();
        return {message: "Player added successfully"};
    }
    // if the invited is a player, and inviter is a parent
    else if(rel=='child'){
        const parent = await Parent.findById(invitation.inviterId);
        if(!parent){
            throw new Error("Invalid invitation");
        }
        const child = await Player.findOne({"emailAddress.email": invitation.invitedEmail});
        if(!child){
            throw new Error("Invalid invitation");
        }
        if(child.parents.length>=2){
            throw new Error("The child already has 2 parents");
        }
        parent.children.push(child.id);
        child.parents.push(parent.id);
        await parent.save();
        await child.save();
        await invitation.deleteOne();
        return {message: "Parent added successfully"};

    }
}catch(err){
    throw new APIError({
        message: "Error adding User",
        status: 501,
        stack: err.stack,
    });
}
}

module.exports = {
    updateProfile,
    deleteProfile,
    searchUsers,
    inviteUser,
    addUser,
};
