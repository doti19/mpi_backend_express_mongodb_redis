const mongoose = require('mongoose');



const reminderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the reminder'],
    },
    description: {
        type: String,
        required: [true, 'Please provide a description for the reminder'],
    },
    date: {
        type: Date,
        required: [true, 'Please provide a date for the reminder'],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: [true, 'Please provide the user for the reminder'],
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
},);

const Reminder = mongoose.model('Reminder', reminderSchema);
module.exports = Reminder;
