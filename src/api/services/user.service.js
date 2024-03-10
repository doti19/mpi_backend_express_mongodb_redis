const {User} = require('../models').User;
const {APIError} = require('../../errors/apiError');
const { userTransformer } = require('../../transformers');
const {userJoiValidator} = require('../../validators');

const profile = async(req, res, next)=>{
    try{
    
    }catch(err){
        throw new APIError
    }
}

const updateProfile = async(user, body)=>{
    try{
        userJoiValidator.updateProfileValidator(body);
    }catch(err){
        throw new Error(err);
    }
    const transformedBody = userTransformer.userUpdateBodyTransformer(body);

    try{
        const updatedUser = await User.findByIdAndUpdate({
            _id: user._id,
        }, transformedBody, {new: true});
        return updatedUser;
    }catch(err){
        throw new Error(err);
    }
}

module.exports = {
    profile,
    updateProfile,
}