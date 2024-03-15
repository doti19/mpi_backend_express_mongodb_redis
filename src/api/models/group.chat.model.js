const mongoose = require('mongoose');

const groupChatSchema = new mongoose.Schema({
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    group:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    type:{
        type: String,
        enum: ['reply', 'message'],
        default: 'message',
    },
    message:{
        type: String,
        trim: true,
       
    },
    isRead:{
        type: Boolean,
        default: false
    },
    files:[{
        fieldName: String,
        originalName: String,
        encoding: String,
        mimetype: String,
        filename: String,
        size: Number,
    }],
    replyTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'GroupMessage',
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    readBy:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

GroupChat = mongoose.model('GroupChat', groupChatSchema);
module.exports = GroupChat;