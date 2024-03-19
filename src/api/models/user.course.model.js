const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userQuestionSchema = new Schema({
    questionId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Question",
        required: true,
    },
    // status: {
    //     type: String,
    //     enum: ["answered", "locked", "started", "not started"],
    //     default: "locked",
    // },
    userAnswer:{
        type: String,
    },
    answerStatus:{
        type: String,
        enum: ["correct", "incorrect", "unanswered"],
        default: "unanswered",
    }
})


const userAssessmentSchema = new Schema({
    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Assessment",
        required: true,
    },
    questions:{
        type: [userQuestionSchema],
    },
    status: {
        type: String,
        enum: ["passed", "failed", "unlocked", "locked"],
        default: "locked",
    },
});

const userVideoSchema = new Schema({
    videoId: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Video",
        required: true,
    },
    status: {
        type: String,
        enum: ["new", "finished", "unfinished", "locked"],
        default: "locked",
    },
});
const userCurriculumSchema = new Schema({
    curiculum: {
        type: mongoose.Schema.Types.ObjectId,
        // ref: "Module",
        required: true,
    },
    // status: {
    //     type: String,
    //     enum: ["unlocked", "locked"],
    //     default: "locked",
    // },
});

const userCourseSchema = new Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course",
    },
    startingDate: Date,
    assessments: [userAssessmentSchema],
    videos: [userVideoSchema],
    videosFinished:{
        type: Boolean,
        default: false,
    },
    assessmentsFinished:{
        type: Boolean,
        default: false,
    },
    canView:{
        type: Boolean,
        default: true,
    },
    status: {
        type: String,
        enum: ["started", "not started", "finished", "locked", "unlocked"],
        default: "locked",
    },
});

const userCoursesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    courses: [userCourseSchema],
    
    lastChecked: {
        type: Date,
        default: Date.now,
    },
});

const UserCourses = mongoose.model("UserCourses", userCoursesSchema);
const UserCourse = mongoose.model("UserCourse", userCourseSchema);
const UserVideo = mongoose.model("UserVideo", userVideoSchema);
const UserAssessment = mongoose.model("UserAssessment", userAssessmentSchema);

module.exports = {
    UserCourses,
    UserCourse,
    UserVideo,
    UserAssessment,
};
