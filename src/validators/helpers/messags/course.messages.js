const courseTitleMessages={
   'string.base': 'Course title should be string',
    'string.empty': 'Course title cannot be an empty field',
    'string.min': 'Course title should have a minimum length of {#limit}',
    'string.max': 'Course title should have a maximum length of {#limit}',
    'any.required': 'Course title is a required field'
}
const courseDescriptionMessages={
    'string.base': 'Course description should be string',
    'string.empty': 'Course description cannot be an empty field',
    'string.min': 'Course description should have a minimum length of {#limit}',
    'string.max': 'Course description should have a maximum length of {#limit}',
    'any.required': 'Course description is a required field'
}
const courseIsPublishedMessages={
    'boolean.base': 'Course isPublished should be a boolean',
    'any.required': 'Course isPublished is a required field'
}
const expectedCourseDurationMessages={
    'number.base': 'Expected course duration should be a number',
    'any.required': 'Expected course duration is a required field'
}
const courseLevelMessages={
    'string.base': 'Course level should be string',
    'string.empty': 'Course level cannot be an empty field',
    'string.valid': 'Course level should be either begginer, intermediate or advanced',
    'any.required': 'Course level is a required field',
    'any.only': 'Course level should be one of the allowed values: {#valids}'
}

const courseExternalResourcesMessages={
   'array.base': 'External resources should be an array',
    'array.empty': 'External resources cannot be an empty field',
    'array.min': 'External resources should have a minimum length of {#limit}',
    'any.required': 'External resources is a required field',
    'array.items.string.base': 'External resources should be an array of strings',
    'array.items.string.empty': 'External resources should not contain empty strings',
    'array.items.string.uri': 'External resources should be an array of valid urls'
}



const moduleTitleMessages={
    'string.base': 'Module title should be string',
    'string.empty': 'Module title cannot be an empty field',
    'string.min': 'Module title should have a minimum length of {#limit}',
    'string.max': 'Module title should have a maximum length of {#limit}',
    'any.required': 'Module title is a required field'
}
const moduleDescriptionMessages={
    'string.base': 'Module description should be string',
    'string.empty': 'Module description cannot be an empty field',
    'string.min': 'Module description should have a minimum length of {#limit}',
    'string.max': 'Module description should have a maximum length of {#limit}',
    'any.required': 'Module description is a required field'
}


const lessonTitleMessages={
    'string.base': 'Lesson title should be string',
    'string.empty': 'Lesson title cannot be an empty field',
    'string.min': 'Lesson title should have a minimum length of {#limit}',
    'string.max': 'Lesson title should have a maximum length of {#limit}',
    'any.required': 'Lesson title is a required field'
}
const lessonDescriptionMessages={
    'string.base': 'Lesson description should be string',
    'string.empty': 'Lesson description cannot be an empty field',
    'string.min': 'Lesson description should have a minimum length of {#limit}',
    'string.max': 'Lesson description should have a maximum length of {#limit}',
    'any.required': 'Lesson description is a required field'
}


const videoTitleMessages={
    'string.base': 'Video title should be string',
    'string.empty': 'Video title cannot be an empty field',
    'string.min': 'Video title should have a minimum length of {#limit}',
    'string.max': 'Video title should have a maximum length of {#limit}',
    'any.required': 'Video title is a required field'
}
const videoDescriptionMessages={
    'string.base': 'Video description should be string',
    'string.empty': 'Video description cannot be an empty field',
    'string.min': 'Video description should have a minimum length of {#limit}',
    'string.max': 'Video description should have a maximum length of {#limit}',
    'any.required': 'Video description is a required field'
}
const videoUrlMessages={
    'string.base': 'Video url should be string',
    'string.empty': 'Video url cannot be an empty field',
    'string.uri': 'Video url should be a valid url',
    'any.required': 'Video url is a required field'
}
const videoDurationMessages={
    'number.base': 'Video duration should be a number',
    'any.required': 'Video duration is a required field'
}
const videoThumbnailMessages={
    'string.base': 'Video thumbnail should be string',
    'string.empty': 'Video thumbnail cannot be an empty field',
    'string.uri': 'Video thumbnail should be a valid url',
    'any.required': 'Video thumbnail is a required field'
}
const videoCaptionMessages={
    'string.base': 'Video caption should be string',
    'string.empty': 'Video caption cannot be an empty field',
    'string.min': 'Video caption should have a minimum length of {#limit}',
    'string.max': 'Video caption should have a maximum length of {#limit}',
    'any.required': 'Video caption is a required field'
}

const assessmentTypeMessages={
    'string.base': 'Assessment type should be string',
    'string.empty': 'Assessment type cannot be an empty field',
    'string.valid': 'Assessment type should be one of {#valids}',
    'any.required': 'Assessment type is a required field'
}
const assessmentTitleMessages={
    'string.base': 'Assessment title should be string',
    'string.empty': 'Assessment title cannot be an empty field',
    'any.required': 'Assessment title is a required field',
}
const assessmentDescriptionMessages={
    'string.base': 'Assessment description should be string',
    'string.empty': 'Assessment description cannot be an empty field',
    'any.required': 'Assessment description is a required field',
}
const assessmentTimeLimitMessages={
    'number.base': 'Assessment time limit should be a number',
    'any.required': 'Assessment time limit is a required field'
}
const assessmentAttemptsAllowedMessages={
    'number.base': 'Assessment attempts allowed should be a number',
    'any.required': 'Assessment attempts allowed is a required field'
}

const questionTypeMessages={
    'string.base': 'Question type should be string',
    'string.empty': 'Question type cannot be an empty field',
    'string.valid': 'Question type should be one of {#valids}',
    'any.required': 'Question type is a required field'
}
const questionMessages={
    'string.base': 'Question should be string',
    'string.empty': 'Question cannot be an empty field',
    'any.required': 'Question is a required field'
}
const questionChoicesMessages={
    'array.base': 'Choices should be an array',
    'array.empty': 'Choices cannot be an empty field',
    'array.min': 'Choices should have a minimum length of {#limit}',
    'any.required': 'Choices is a required field',
    'array.items.string.base': 'Choices should be an array of strings',
    'array.items.string.empty': 'Choices should not contain empty strings'
}
const questionCorrectAnswerMessages={
    'string.base': 'Correct answer should be string',
    'string.empty': 'Correct answer cannot be an empty field',
    'any.required': 'Correct answer is a required field'
}
const prevCourseMessage = {
    'string.base': 'Previouse Course Id must be a string',
    'string.length': 'Previouse Course Id must be 24 characters',
    'string.hex': 'Previouse Course Id must be a hexadecimal',
    'string.empty': 'Previouse Course Id must not be empty',
    'any.required': 'Previouse Course Id is required',
}

const nextCourseMessage = {
    'string.base': 'Previouse Course Id must be a string',
    'string.length': 'Previouse Course Id must be 24 characters',
    'string.hex': 'Previouse Course Id must be a hexadecimal',
    'string.empty': 'Previouse Course Id must not be empty',
    'any.required': 'Previouse Course Id is required',
}

const startingCourseMessages = {
    'boolean.base': 'Starting Course must be a boolean',
    'any.required': 'Starting Course is required',
}



const moduleLessonsMessages={
    'array.base': 'Module lessons should be an array',
    'array.empty': 'Module lessons cannot be an empty field',
    'array.min': 'Module lessons should have a minimum length of {#limit}',
    'any.required': 'Module lessons is a required field',
    'array.items.object.base': 'Module lessons should be an array of objects',
    'array.items.object.empty': 'Module lessons should not contain empty objects',
    'array.items.object.keys': 'Module lessons should be an array of objects with keys: title, description',
    title: lessonTitleMessages,
    description: lessonDescriptionMessages,
}


const courseCurriculumMessages={
    'array.base': 'Curriculum should be an array',
    'array.empty': 'Curriculum cannot be an empty field',
    'array.items.object.base': 'Module lessons should be an array of objects',
    'array.items.object.empty': 'Module lessons should not contain empty objects',
    'array.items.object.keys': 'Module lessons should be an array of objects with keys: title, description, lessons',
    title: moduleTitleMessages,
    description: moduleDescriptionMessages,
    lessons: moduleLessonsMessages,
}



const videoSchemaMessages={
    'array.base': 'Video should be an array',
"array.empty": "Video cannot be an empty field",
"array.min": "Video should have a minimum length of {#limit}",
"any.required": "Video is a required field",
"array.items.object.base": "Video should be an array of objects",
"array.items.object.empty": "Video should not contain empty objects",
"array.items.object.keys": "Video should be an array of objects with keys: title, description, url, duration, thumbnail, caption",
title: videoTitleMessages,
description: videoDescriptionMessages,
url: videoUrlMessages,
duration: videoDurationMessages,
thumbnail: videoThumbnailMessages,
caption: videoCaptionMessages
}

const questionSchemaMessages={
    'array.base': 'Question should be an array',
    'array.empty': 'Question cannot be an empty field',
    'array.min': 'Question should have a minimum length of {#limit}',
    'any.required': 'Question is a required field',
    'array.items.object.base': 'Question should be an array of objects',
    'array.items.object.empty': 'Question should not contain empty objects',
    'array.items.object.keys': 'Question should be an array of objects with keys: questionype, question, choices, correctAnswer',
    questionType: questionTypeMessages,
    question: questionMessages,
    choices: questionChoicesMessages,
    correctAnswer: questionCorrectAnswerMessages
}

const assessmentSchemaMessages={
    'array.base': 'Assessment should be an array',
    'array.empty': 'Assessment cannot be an empty field',
    'array.min': 'Assessment should have a minimum length of {#limit}',
    'any.required': 'Assessment is a required field',
    'array.items.object.base': 'Assessment should be an array of objects',
    'array.items.object.empty': 'Assessment should not contain empty objects',
    'array.items.object.keys': 'Assessment should be an array of objects with keys: assessmentType, title, description, timeLimit, attemptsAllowed, questions',
    assessmentType: assessmentTypeMessages,
    title: assessmentTitleMessages,
    description: assessmentDescriptionMessages,
    timeLimit: assessmentTimeLimitMessages,
    attemptsAllowed: assessmentAttemptsAllowedMessages,
    questions: questionSchemaMessages
}

const courseSchemaMessages={
    title: courseTitleMessages,
    description: courseDescriptionMessages,
    isPublished: courseIsPublishedMessages,
    expectedCourseDuration: expectedCourseDurationMessages,
    level: courseLevelMessages,
    externalResources: courseExternalResourcesMessages,
    curriculum: courseCurriculumMessages,
    assessment: assessmentSchemaMessages,
    video: videoSchemaMessages
}


module.exports={
    courseSchemaMessages,
    courseTitleMessages,
    courseDescriptionMessages,
    courseIsPublishedMessages,
    expectedCourseDurationMessages,
    courseLevelMessages,
    courseExternalResourcesMessages,
    courseCurriculumMessages,
    moduleTitleMessages,
    moduleDescriptionMessages,
    moduleLessonsMessages,
    lessonTitleMessages,
    lessonDescriptionMessages,
    videoSchemaMessages,
    videoTitleMessages,
    videoDescriptionMessages,
    videoUrlMessages,
    videoDurationMessages,
    videoThumbnailMessages,
    videoCaptionMessages,
    assessmentTypeMessages,
    assessmentTitleMessages,
    assessmentDescriptionMessages,
    assessmentTimeLimitMessages,
    assessmentAttemptsAllowedMessages,
    questionTypeMessages,
    questionMessages,
    questionChoicesMessages,
    questionCorrectAnswerMessages,
    questionSchemaMessages,
    assessmentSchemaMessages,
    prevCourseMessage,
    nextCourseMessage,
    startingCourseMessages
}








