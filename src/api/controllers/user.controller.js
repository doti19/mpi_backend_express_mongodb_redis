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
});

const viewProfileCourses = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewPlayerCourses(req.user.id, req.query);
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
});

const viewPlayerCourse = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.canView(userService.viewPlayerCourses, req.user, {id: req.params.id, query: req.query});
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
});

const updateCourseProgress = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.updateCourseProgress(req.params.courseId, req.body, req.user);
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
});

const viewProfileDashboard = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewProfileDashboard(req.user);
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

const viewChildren = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewChildren(req.user);
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
});

const viewChild = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewChild(req.params.id, req.user);
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
});

const viewChildCoaches = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewChildCoaches(req.params.id, req.user);
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
});


const viewChildCoach = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewChildCoach(req.params.id, req.params.coachId, req.user);
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
});


const viewPlayers = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewPlayers(req.user);
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
});

const viewPlayer = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewPlayer(req.params.id, req.user);
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
});

const viewPlayerParents = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewPlayerParents(req.params.id, req.user);
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
});

const viewPlayerParent = catchAsync(async(req, res, next)=>{
    try{
        const result = await userService.viewPlayerParent(req.params.id, req.params.parentId, req.user);
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
});

module.exports = {
    viewProfile,
    updateProfile,
    deleteProfile,
    searchUsers,
    inviteUser,
    addUser,
    viewProfileCourses,
    viewPlayerCourse,
    updateCourseProgress,
    viewProfileDashboard,


    viewChildren,
    viewChild,
    viewChildCoaches,
    viewChildCoach,

    viewPlayers,
    viewPlayer,
    viewPlayerParents,
    viewPlayerParent
};
