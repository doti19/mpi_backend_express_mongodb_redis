const Joi = require('joi');
const { validate } = require('../helpers/schema.validation.helper');
const {courseSchema, updateCourseSchema} = require('./helpers/fields/course.fields')
const createCourseValidator = (body) => {
    validate(courseSchema, body);
};

const updateCourseValidator = (body)=>{
    validate(updateCourseSchema, body);
}

module.exports={
    createCourseValidator,
    updateCourseValidator
}