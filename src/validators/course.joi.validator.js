const Joi = require('joi');
const { Types } = require('mongoose');
const { validate } = require('../helpers/schema.validation.helper');
const {courseSchema, updateCourseSchema} = require('./helpers/fields/course.fields')
const createCourseValidator = (body) => {
    validate(courseSchema, body);
};

const updateCourseValidator = (body)=>{
    validate(updateCourseSchema, body);
}

const updateVideoUserCourseValidator = (body)=>{
    const schema = Joi.object().keys({
        status: Joi.string().valid('finished', 'unfinished',).required(),
        
    });
    validate(schema, body);
}

const updateCoursePlan = (body)=>{
    const schema = Joi.object().keys({
        videoId: Joi.string().custom((value, helpers)=>{
            if(!Types.ObjectId.isValid(value)){
                return helpers.error('any.invalid');
            }
            return value;
         }).required(),
         assessmentId: Joi.string().custom((value, helpers)=>{
            if(!Types.ObjectId.isValid(value)){
                return helpers.error('any.invalid');
            }
            return value;
         }).required(),
        
    });
    validate(schema, body);

}

const updateAssessmentUserCourseValidator = (body)=>{
    const schema = Joi.object().keys({
     questions:Joi.array().items(Joi.object().keys({
                questionId: Joi.string().custom((value, helpers)=>{
                    if(!Types.ObjectId.isValid(value)){
                        return helpers.error('any.invalid');
                    }
                    return value;
                }).required(),
                userAnswer: Joi.string().required(),
                   
                // answerStatus: Joi.string().valid('correct', 'incorrect', 'unanswered').required(),
                // status: Joi.string().valid('answered', 'started').required(),
            })).required(),
     
        
    });
    validate(schema, body);
}


module.exports={
    createCourseValidator,
    updateCourseValidator,
    updateVideoUserCourseValidator,
    updateAssessmentUserCourseValidator,
    updateCoursePlan
}