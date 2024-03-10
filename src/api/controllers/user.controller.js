const catchAsync = require('../../utils/catchAsync');
const {APIError} = require("../../errors/apiError");
const {userService} = require('../services');

const profile = catchAsync(async(req, res, next)=>{
    try{

        const user = req.user.toJSON();
        res.send(user);
    }catch(error){
        return next(new APIError({message: error.message, status: error.status, stack: error.stack}));
    }
});

const updateProfile = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.updateProfile(req.user, req.body);
        res.send(result);
    }catch(error){
        return next(new APIError({message: error.message, status: error.status, stack: error.stack}));
    }
})


module.exports = {
    profile,
    updateProfile
}