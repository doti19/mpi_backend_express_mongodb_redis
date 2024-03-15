const {User: UserSchema, Reminder} = require('../models');
const User = UserSchema.User;
const Player = UserSchema.Player;
const Coach = UserSchema.Coach;
const Parent = UserSchema.Parent;

const {APIError} = require("../../errors/apiError");
const { reminderJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");

const createReminder = async (reminder, user) => {
    reminderJoiValidator.createReminderSchema(reminder);
   
    reminder.userId = user._id;
    const newReminder = await new Reminder(reminder).save();
    return newReminder;
};

const getReminders = async (query, user) => {
    const features = new APIFeatures(Reminder.findOne({ userId: user._id.toString() }), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const reminders = await features.query;
    return reminders;
};

const getReminder = async (id, user) => {
    const reminder = await Reminder.findOne({ _id: id, userId: user._id.toString() });
    if (!reminder) {
        throw new APIError({
            message: "Reminder not found",
            status: 404,
        });
    }
    return reminder;
};

const updateReminder = async (id, reminder, user) => {
     reminderJoiValidator.updateReminderSchema(reminder);
    
     delete reminder.userId;
     delete reminder.createdAt;
    
    const updatedReminder = await Reminder.findOneAndUpdate({ _id: id, userId: user._id.toString() },
        reminder,
        { new: true,runValidators: true,});
    if (!updatedReminder) {
        throw new APIError({
            message: "Reminder not found",
            status: 404,
        });
    }
    return updatedReminder;
};

const deleteReminder = async (id, user) => {
    const deletedReminder = await Reminder.findOneAndDelete({ _id: id, userId: user._id.toString() });
    if (!deletedReminder) {
        throw new APIError({
            message: "Reminder not found",
            status: 404,
        });
    }
    return deletedReminder;
};


const getRemindersByPlayerId = async (playerId, user) => {
    const player = await Player.findOne({ _id: playerId });
    if (!player) {
        throw new APIError({
            message: "Player not found",
            status: 404,
        });
    }

    const parentExists = player.parents.map(id => id.toString()).includes(user.id.toString())
    const coachExists = player.coaches.map(id => id.toString()).includes(user.id.toString())
    if (!parentExists && !coachExists) {
        throw new APIError({
            message: "You are not authorized to perform this action",
            status: 403,
        });
    }
    const reminders = await Reminder.find({ userId: playerId });
    return reminders;
}

const createReminderByPlayerId = async (playerId, reminder, user) => {
    const player = await Player.findOne({
        _id: playerId,
        // $or: [{ parentId: user._id }, { coachId: user._id }],
    });
    if (!player) {
        throw new APIError({
            message: "Player not found",
            status: 404,
        });
    }
    const parentExists = player.parents.map(id => id.toString()).includes(user.id.toString())
    const coachExists = player.coaches.map(id => id.toString()).includes(user.id.toString())
    if(!parentExists && !coachExists){
        throw new APIError({
            message: "You are not authorized to perform this action",
            status: 403,
        });
    }
    reminderJoiValidator.createReminderSchema(reminder);
    // console.group(Date.parse(reminder.date)<=Date.now());
    if(Date.parse(reminder.date)<Date.now()){
        throw new APIError({
            message: "Date should be in the future",
            status: 400,
        });
    }

    reminder.userId = playerId;
    const newReminder = await new Reminder(reminder).save();
    return newReminder;
}

const getReminderByPlayerId = async (params, user) => {
    const player = await Player.findOne({
        _id: params.playerId,
        // $or: [{ parentId: user._id }, { coachId: user._id }],
    });
    if (!player) {
        throw new APIError({
            message: "Player not found",
            status: 404,
        });
    }

    const parentExists = player.parents.map(id => id.toString()).includes(user.id.toString())
    const coachExists = player.coaches.map(id => id.toString()).includes(user.id.toString())
    if (!parentExists && !coachExists) {
        throw new APIError({
            message: "You are not authorized to perform this action",
            status: 403,
        });
    }

    const reminder = await Reminder.findOne({ _id: params.reminderId, userId: params.playerId });
    if (!reminder) {
        throw new APIError({
            message: "Reminder not found",
            status: 404,
        });
    }
    return reminder;
}

const updateReminderByPlayerId = async (params, reminder, user) => {
    const player = await Player.findOne({
        _id: params.playerId,
        // $or: [{ parentId: user._id }, { coachId: user._id }],
    });
    if (!player) {
        throw new APIError({
            message: "Player not found",
            status: 404,
        });
    }
    const parentExists = player.parents.map(id => id.toString()).includes(user.id.toString())
    const coachExists = player.coaches.map(id => id.toString()).includes(user.id.toString())
    if (!parentExists && !coachExists) {
        throw new APIError({
            message: "You are not authorized to perform this action",
            status: 403,
        });

    }

     reminderJoiValidator.updateReminderSchema(reminder);
    delete reminder.userId;
    delete reminder.createdAt;
    const updatedReminder = await Reminder.findOneAndUpdate(
        { _id: params.reminderId, userId: params.playerId },
        reminder,
        {
            new: true,
            runValidators: true,
        }
    );
    if (!updatedReminder) {
        throw new APIError({
            message: "Reminder not found",
            status: 404,
        });
    }
    return updatedReminder;
}

const deleteReminderByPlayerId = async (params, user) => {
    const player = await Player.findOne({
        _id: params.playerId,
        // $or: [{ parentId: user._id }, { coachId: user._id }],
    });
    if (!player) {
        throw new APIError({
            message: "Player not found",
            status: 404,
        });
    }

    const parentExists = player.parents.map(id => id.toString()).includes(user.id.toString())
    const coachExists = player.coaches.map(id => id.toString()).includes(user.id.toString())
    if (!parentExists && !coachExists) {
        throw new APIError({
            message: "You are not authorized to perform this action",
            status: 403,
        });
    }


    const deletedReminder = await Reminder.findOneAndDelete({
        _id: params.reminderId,
        userId: params.playerId,
    });

    if (!deletedReminder) {
        throw new APIError({
            message: "Reminder not found",
            status: 404,
        });
    }
    return deletedReminder;
}



module.exports = {
    createReminder,
    getReminders,
    getReminder,
    updateReminder,
    deleteReminder,

    getRemindersByPlayerId,
    createReminderByPlayerId,
    getReminderByPlayerId,
    updateReminderByPlayerId,
    deleteReminderByPlayerId,
};