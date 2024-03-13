const {Course} = require('../models');
const { APIError } = require('../../errors/apiError');
const {courseJoiValidator} = require('../../validators');
const {courseTransformer} = require('../../transformers');
const APIFeatures = require('../../utils/apiFeatures');

const createCourse = async(courseData)=>{
    courseJoiValidator.createCourseValidator(courseData);

    const course = await Course.create(courseData);
    return course;
}

const getAllCourses = async(query)=>{
    const features = new APIFeatures(Course.find(), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const courses = await features.query;
    return {result: courses.length, courses};
}

module.exports = {
    createCourse,
    getAllCourses
};
