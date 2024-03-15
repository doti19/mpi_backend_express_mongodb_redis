const jwt = require('jsonwebtoken');
const {jwt_token: token} = require('../config/config');
const {UserToken, User: UserModel} = require('../api/models');
const User = UserModel.User;

const verifyToken = accessToken => {
    try{
        const verified =  jwt.verify(accessToken.token, token.access.secret);
        if(!verified) return {error: true, token: null, message: "Invalid access token"};
        
        // const user = await User.findById(verified.id);
        // if(!user) return {error: true, token: null, message: "user not found"};
        return verified;
    } catch(error){
        console.log(error);
        return {error: true, token: null, message: error};
    }
}

const verifyRefreshToken = async refreshToken => {
    try{
        
        const verified =  jwt.verify(refreshToken, token.refresh.secret);
        
        if(!verified) return {error: true, token: null, message: "Invalid refresh token"};
        const userToken = await UserToken.findOne({
            token: refreshToken
        });

        if(!userToken) return {error: true, token: null, message: "refresh token not found"};
        
        return {error: false, token: userToken, message: "refresh token verified"};
    } catch(error){
        
        return {error: true, token: null, message: error};
    }
};


module.exports = {
    verifyRefreshToken,
    verifyToken,
};