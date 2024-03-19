const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    groupName:{
        type: String,
        required: true,
        trim: true
    },
    members:[{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status:{
            type: String,
            enum: ['pending', 'approved', 'removed'],
            default: 'pending',
        },
    }],
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description:{
        type: String,
        trim: true
    },
    avatar:{
        type: String,
        default: 'group.png'
    },
    chat_background_image:{
        type: String,
        default: 'group-background.jpg'
    },
    status:{
        type: String,
        enum: ['available', 'not available', 'delete', 'violated terms'],
        default: 'available',
    },
    createdAt:{
        type: Date,
        default: Date.now
    },

},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

groupSchema.pre(/^find/, function(next){
    this.populate({
        path: 'members.user',
        select: 'firstName lastName avatar -__t'
    })
    .populate({
        path: 'createdBy',
        select: 'firstName lastName avatar -__t'
    });
    next();
});

Group = mongoose.model('Group', groupSchema);
module.exports = Group;