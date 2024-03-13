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


module.exports = {
    createCourse,
    getAllCourses
};