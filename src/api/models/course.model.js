const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
});

const moduleSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    lessons: [lessonSchema],
});

const questionSchema = new Schema({
    questionType: {
        type: String,
        enum: ["multiple-choice", "fill-in-the-blank"], //for quize, for homework: reflection (mn temark) might enforce word count, for assignment: reflection on other general
        required: true,
    },
    question: {
        type: String,
        required: true,
    },
    choices: [String],
    correctAnswer: {
        type: String,
        //TODO Should i make this an array in case there are multiple choices that are correct?
        required: true,
    },

    // status: {
    //     type: String,
    //     enum: ['correct', 'incorrect']
    // }
});

//TODO THIS MAY NEED TO HAVE A REFERENCE, LIKE AFTER WHAT VIDEOS
const assessmentSchema = new Schema({
    assessmentType: {
        type: String,
        enum: ["quiz", "assignment", "homework"],
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    timeLimit: {
        type: Number,
        default: 5,
    },
    attemptsAllowed: {
        type: Number,
        default: 3,
    },

    questions: [questionSchema],
});

const videoSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    caption: {
        type: String,
    },
});

const courseSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        isPublished: {
            type: Boolean,
            default: false,
        },
        level: {
            type: String,
            enum: ["begginer", "intermediate", "advanced"],
        },
        expectedCourseDuration: {
            type: Number,
        },
        externalResources: [
            {
                type: String,
                //TODO make it to accept url
            },
        ],
        curriculum: [moduleSchema],
    },
    {
        timestamps: true,
    }
);

const Course = mongoose.model("Course", courseSchema);
const Assessment = mongoose.model("Assessment", assessmentSchema);
const Video = mongoose.model("Video", videoSchema);
module.exports = {
    Course,
    Assessment,
    Video,
};
