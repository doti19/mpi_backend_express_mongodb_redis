const catchAsync = require("../../utils/catchAsync");
const { APIError } = require("../../errors/apiError");
const { userService } = require("../services");

const viewProfile = catchAsync(async (req, res, next) => {
    try {
        const user = req.user.toJSON();
        console.log('what is the problem')
        res.send(user);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const updateProfile = catchAsync(async (req, res, next) => {
    try {
        const result = await userService.updateProfile(req.user, req.body);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const deleteProfile = catchAsync(async (req, res, next) => {
    try {
        const result = await userService.deleteProfile(req.user);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const searchUsers = catchAsync(async (req, res, next) => {
    try {
        const result = await userService.searchUsers(req.query);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const inviteUser = catchAsync(async (req, res, next) => {
    try {
        const result = await userService.inviteUser( req.body, req.user);
        res.send(result);
    } catch (error) {
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const addUser = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.addUser(req.query, req.user);
        res.send(result)
    }catch(err){
        return next(
            new APIError({
                message: err.message,
                status: err.status,
                stack: err.stack,
            })
        );
    
    }
})

module.exports = {
    viewProfile,
    updateProfile,
    deleteProfile,
    searchUsers,
    inviteUser,
    addUser,
};
