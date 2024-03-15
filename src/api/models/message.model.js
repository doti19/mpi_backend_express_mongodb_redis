const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    receiver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // required: true
    },
    message:{
        type: String,
        trim: true,
    },
    isRead:{
        type: Boolean,
        default: false
    },
    conversationId:{
        type: String,
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
},{
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

messageSchema.pre('/^find/', function(next){
    this.populate({
        path: 'receiver',
        select: 'firstName lastName avatar'
    })
    .populate({
        path: 'sender',
        select: 'firstName lastName avatar'
    });
    next();
});

messageSchema.pre('/^findOneAnd', async function(next){
    this.r = await this.findOne();
    console.log(this.r);
    next();
});

module.exports = mongoose.model('Message', messageSchema);