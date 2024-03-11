const {User} = require('../models').User;
const {APIError} = require('../../errors/apiError');
const { userTransformer } = require('../../transformers');
const {userJoiValidator} = require('../../validators');
const APIFeatures = require('../../utils/apiFeatures')
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

const deleteProfile = async(user)=>{
    try{
        const deletedUser = await User.findByIdAndDelete({_id: user._id});
        return { message: 'User deleted successfully'};
    }catch(err){
        throw new APIError({message: 'Error deleting User', status: 501, stack: err.stack});
    }
}

const searchUsers = async(query)=>{
    // try{
    //     userJoiValidator.searchUserValidator(query);
    // }catch(err){
    //     throw new Error(err);
    // }
    // const transformedQuery = userTransformer.searchUserQueryTransformer(query);
    try{
        // const users = await User.find(transformedQuery);
        const apiFeatures = new APIFeatures(User.find(), query).search();
        const users = await apiFeatures.query;
        return {result: users.length, users};
    }catch(err){
        throw new APIError({message: 'Error searching for User', status: 501, stack: err.stack});
    }
}


module.exports = {
    updateProfile,
    deleteProfile,
    searchUsers,
}