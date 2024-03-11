const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userAssessmentSchema = new Schema({
    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true,
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
        ref: "Video",
        required: true,
    },
    status: {
        type: String,
        enum: ["new", "finished", "unfinished"],
        default: "new",
    },
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
    },
    courses: [userCourseSchema],
});

const Token = mongoose.model("Token", tokenSchema);

module.exports = Token;
