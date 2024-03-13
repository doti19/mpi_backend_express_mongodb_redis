const Joi = require('joi');
const { validate } = require('../helpers/schema.validation.helper');
const {courseSchema} = require('./helpers/fields/course.fields')
const createCourseValidator = (body) => {
    validate(courseSchema, body);
};

module.exports={
    createCourseValidator
}