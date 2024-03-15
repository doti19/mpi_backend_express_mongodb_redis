const {User: UserSchema, Message} = require('../models');
const User = UserSchema.User;

const {APIError} = require("../../errors/apiError");
const { messageJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");


//createMessage,
// getAllMessages,
// getMessage,
// updateMessage,
// deleteMessage,

const createMessage = async(body, user)=>{
    
    messageJoiValidator.createMessageSchema(body);
    console.log('hey')

    if(body.receiver === user.id){
        throw new APIError({
            message: "You can't send message to yourself",
            status: 400,
        });
    }
    if(!body.receiver){
        throw new APIError({
            message: "Receiver is required",
            status: 400,
        });
    }
    const message = new Message({
        ...body,
        sender: user.id,
       createdAt: Date.now(), 
    });

    // const message = new Message({
    //     ...body,
        
    // });

    await message.save();
    return message;
}

const getAllMessages = async(query, user)=>{
    const features = new APIFeatures(Message.find({ $or: [{ sender: user.id }, { receiver: user.id }] }), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const messages = await features.query;
    return messages;
}

const getMessage = async(id, user)=>{
    const message = await Message.findOne({ _id: id, $or: [{ sender: user.id }, { receiver: user.id }] });
    if (!message) {
        throw new APIError({
            message: "Message not found",
            status: 404,
        });
    }
    return message;
}

const updateMessage = async(id, body, user)=>{
    messageJoiValidator.updateMessageSchema(body);
    const message = await Message.findOne({ _id: id,  sender: user.id });
    if (!message) {
        throw new APIError({
            message: "Message not found",
            status: 404,
        });
    }
    if(body.isRead){
        delete body.isRead;
    }
    Object.assign(message, body);
    await message.save();
    return message;
}

const isReadMessage = async(id, user)=>{
    const message = await Message.findOne({_id: id, receiver: user.id});
    if (!message) {
        throw new APIError({
            message: "Message not found",
            status: 404,
        });
    }
    message.isRead = true;
    await message.save();
    return message;
}

const deleteMessage = async(id, user)=>{
    const message = await Message.findOne({ _id: id,  sender: user.id  });
    if (!message) {
        throw new APIError({
            message: "Message not found",
            status: 404,
        });
    }
    await message.deleteOne();
    return { message: "Message deleted successfully" };
}
module.exports = {
    createMessage,
    getAllMessages,
    getMessage,
    updateMessage,
    isReadMessage,
    deleteMessage,
}


