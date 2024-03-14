const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const {
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
    previousCourseMessages,
    nextCourseMessages,
    previouseCourseIdMessages,
    nextCourseIdMessages,
    startingCourseMessages
} = require("../messags/course.messages");

const courseTitle = Joi.string()
    .min(2)
    //.max(30)
    .messages(courseTitleMessages)
    .label("Course Title");
const courseDescription = Joi.string()
    .min(2)
    //.max(30)
    .messages(courseDescriptionMessages)
    .label("Course Description");
const courseIsPublished = Joi.boolean()
    .messages(courseIsPublishedMessages)
    .label("Course Is Published");
const courseLevel = Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .min(2)
    //.max(30)
    .messages(courseLevelMessages)
    .label("Course Level");
const expectedCourseDuration = Joi.number()
    .messages(expectedCourseDurationMessages)
    .label("Expected Course Duration");
const courseExternalResources = Joi.string()
    .uri()
    .messages(courseExternalResourcesMessages)
    .label("Course External Resources");

const moduleTitle = Joi.string()
    .min(2)
    //.max(30)
    .messages(moduleTitleMessages)
    .label("Module Title");
const moduleDescription = Joi.string()
    .min(2)
    //.max(30)
    .messages(moduleDescriptionMessages)
    .label("Module Description");

const lessonTitle = Joi.string()
    .min(2)
    //.max(30)
    .messages(lessonTitleMessages)
    .label("Lesson Title");
const lessonDescription = Joi.string()
    .min(2)
    //.max(30)
    .messages(lessonDescriptionMessages)
    .label("Lesson Description");

const videoTitle = Joi.string()
    .min(2)
    //.max(30)
    .messages(videoTitleMessages)
    .label("Video Title");
const videoDescription = Joi.string()
    .min(2)
    //.max(30)
    .messages(videoDescriptionMessages)
    .label("Video Description");
const videoUrl = Joi.string()
    .uri()
    .messages(videoUrlMessages)
    .label("Video Url");
const videoDuration = Joi.number()
    .messages(videoDurationMessages)
    .label("Video Duration");
const videoThumbnail = Joi.string()
    .uri()
    .messages(videoThumbnailMessages)
    .label("Video Thumbnail");
const videoCaption = Joi.string()
    .min(2)
    //.max(30)
    .messages(videoCaptionMessages)
    .label("Video Caption");

const assessmentType = Joi.string()
    .valid("quiz", "assignment", "homework")
    .min(2)
    //.max(30)
    .messages(assessmentTypeMessages)
    .label("Assessment Type");
const assessmentTitle = Joi.string()
    .min(2)
    //.max(30)
    .messages(assessmentTitleMessages)
    .label("Assessment Title");
const assessmentDescription = Joi.string()
    .min(2)
    //.max(30)
    .messages(assessmentDescriptionMessages)
    .label("Assessment Description");
const assessmentTimeLimit = Joi.number()
    .messages(assessmentTimeLimitMessages)
    .label("Assessment Time Limit");
const assessmentAttemptsAllowed = Joi.number()
    .messages(assessmentAttemptsAllowedMessages)
    .label("Assessment Attempts Allowed");

const questionType = Joi.string()
    .valid("multiple-choice", "fill-in-the-blanks")
    .min(2)
    //.max(30)
    .messages(questionTypeMessages)
    .label("Question Type");
const question = Joi.string()
    .min(2)
    //.max(30)
    .messages(questionMessages)
    .label("Question");
const questionChoices = Joi.array()
    .items(Joi.string())
    .min(2)
    //.max(30)
    .messages(questionChoicesMessages)
    .label("Question Choices");
const questionCorrectAnswer = Joi.string()
    .min(2)
    //.max(30)
    .messages(questionCorrectAnswerMessages)
    .label("Question Correct Answer");

const previousCourse = Joi.objectId()
    .messages(previouseCourseIdMessages)
    .label("Previouse Course Id");

const nextCourse = Joi.objectId()
    .messages(nextCourseIdMessages)
    .label("Next Course Id");
const startingCourse = Joi.boolean()
    .messages(startingCourseMessages)
    .label("Starting Course");
const courseCurriculumSchema = Joi.object().keys({
    title: moduleTitle.required(),
    description: moduleDescription.required(),
    lessons: Joi.array().items(
        Joi.object().keys({
            title: lessonTitle.required(),
            description: lessonDescription.required(),
        })
    ),
});

const videoSchema = Joi.object().keys({
    title: videoTitle.required(),
    description: videoDescription.required(),
    url: videoUrl.required(),
    duration: videoDuration.required(),
    thumbnail: videoThumbnail.required(),
    caption: videoCaption,
});

const assessmentSchema = Joi.object().keys({
    assessmentType: assessmentType.required(),
    title: assessmentTitle.required(),
    description: assessmentDescription.required(),
    timeLimit: assessmentTimeLimit,
    attemptsAllowed: assessmentAttemptsAllowed,
    questions: Joi.array().items(
        Joi.object().keys({
            questionType: questionType.required(),
            question: question.required(),
            choices: questionChoices,
            correctAnswer: questionCorrectAnswer,
        })
    ),
});

const courseSchema = Joi.object().keys({
    title: courseTitle.required(),
    description: courseDescription.required(),
    level: courseLevel.required(),
    expectedCourseDuration: expectedCourseDuration,
    externalResources: courseExternalResources,
    curriculum: courseCurriculumSchema,
    videos: Joi.array().items(videoSchema),
    assessments: Joi.array().items(assessmentSchema),
    prevCourse: previousCourse,
    nextCourse: nextCourse,
});

const updateCourseSchema = Joi.object().keys({
    title: courseTitle,
    description: courseDescription,
    level: courseLevel,
    startingCourse: startingCourse,
    expectedCourseDuration: expectedCourseDuration,
    externalResources: courseExternalResources,
    curriculum: courseCurriculumSchema,
    videos: Joi.array().items(
        Joi.object().keys({
            title: videoTitle,
            description: videoDescription,
            url: videoUrl,
            duration: videoDuration,
            thumbnail: videoThumbnail,
            caption: videoCaption,
        })
    ),
    assessments: Joi.array().items(
        Joi.object().keys({
            assessmentType: assessmentType,
            title: assessmentTitle,
            description: assessmentDescription,
            timeLimit: assessmentTimeLimit,
            attemptsAllowed: assessmentAttemptsAllowed,
            questions: Joi.array().items(
                Joi.object().keys({
                    questionType: questionType,
                    question: question,
                    choices: questionChoices,
                    correctAnswer: questionCorrectAnswer,
                })
            ),
        })
    ),
    prevCourse: previousCourse,
    nextCourse: nextCourse,
});

module.exports = {
    courseSchema,
    courseTitle,
    courseDescription,
    courseIsPublished,
    expectedCourseDuration,
    courseLevel,
    courseExternalResources,
    moduleTitle,
    moduleDescription,
    lessonTitle,
    lessonDescription,
    videoTitle,
    videoDescription,
    videoUrl,
    videoDuration,
    videoThumbnail,
    videoCaption,
    assessmentType,
    assessmentTitle,
    assessmentDescription,
    assessmentTimeLimit,
    assessmentAttemptsAllowed,
    questionType,
    question,
    questionChoices,
    questionCorrectAnswer,
    previousCourse,
    nextCourse,
    courseCurriculumSchema,
    videoSchema,
    assessmentSchema,
    updateCourseSchema,
    startingCourse,
};
