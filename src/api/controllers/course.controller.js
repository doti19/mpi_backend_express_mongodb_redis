const catchAsync = require('../../utils/catchAsync');
const { APIError } = require('../../errors/apiError');
const { courseService } = require('../services');

const createCourse = catchAsync(async(req, res, next) =>{
    try{
        const result = await courseService.createCourse(req.body);
        res.send(result);
    }
    catch(error){
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const getAllCourses = catchAsync(async(req, res, next) =>{
    try{
        const result = await courseService.getAllCourses(req.query);
        res.send(result);
    }
    catch(error){
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const publishCourse = catchAsync(async(req, res, next) =>{
    try{
        const result = await courseService.publishCourse(req.params.id);
        res.send(result);
    }
    catch(error){
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const updateCourse = catchAsync(async(req, res, next)=>{
    try{
        if(req.user.role !== 'admin'){throw new APIError({message: 'You are not authorized to perform this action', status: 401})}
        const result = await courseService.updateCourse(req.params.id, req.body);
        res.send(result);
    }
    catch(error){
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const deleteCourse = catchAsync(async(req, res, next)=>{
    try{
        if(req.user.role !== 'admin'){throw new APIError({message: 'You are not authorized to perform this action', status: 401})}
        const result = await courseService.deleteCourse(req.params.id);
        res.send(result);
    }
    catch(error){
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

const getCourse = catchAsync(async(req, res, next)=>{
    try{
        const result = await courseService.getCourse(req.params.id);
        res.send(result);
    }
    catch(error){
        return next(
            new APIError({
                message: error.message,
                status: error.status,
                stack: error.stack,
            })
        );
    }
});

module.exports = {
    createCourse,
    getAllCourses,
    publishCourse,
    updateCourse,
    deleteCourse,
    getCourse,
};