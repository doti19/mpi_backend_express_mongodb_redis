const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
});

const curriculumSchema = new Schema({
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
    deleted:{
        type: Boolean,
        default: false,
    }

    // status: {
    //     type: String,
    //     enum: ['correct', 'incorrect']
    // }
});

//TODO THIS MAY NEED TO HAVE A REFERENCE, LIKE AFTER WHAT VIDEOS
const assessmentSchema = new Schema({
    assessmentType: {
        type: String,
        required: true,
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
    deleted:{
        type: Boolean,
        default: false,
    }
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
    deleted:{
        type: Boolean,
        default: false,
    }
    //TODO create lastUpdated fields for videoscheam, and assessment too
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
            required: true,
            enum: ["beginner", "intermediate", "advanced"],
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
        curriculum: {
            type: curriculumSchema,
    },
    videos:{
        type: [videoSchema],
    
    },
    assessments: {
        type: [assessmentSchema],
    },
    startingCourse:{
        type: Boolean,
        default: false,
    },
    prevCourse:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    nextCourse:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    deleted:{
        type: Boolean,
        default: false,
    }
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

courseSchema.methods.toJSON = function () {
    
    const myCourse = this.toObject();

    
    // myCourse.id = this._id;
    delete myCourse._id;
    delete myCourse.__v;
    return {id: this._id, ...myCourse};
};

const Course = mongoose.model("Course", courseSchema);
// const Assessment = mongoose.model("Assessment", assessmentSchema);
// const Video = mongoose.model("Video", videoSchema);
// const Curriculum = mongoose.model("Curriculum", curriculumSchema);
module.exports = Course;
// {
    // Course,
    // Assessment,
    // Video,
    // Curriculum
// };
