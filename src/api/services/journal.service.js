const { Journal, User: UserSchema } = require("../models");
const User = UserSchema.User;

const { APIError } = require("../../errors/apiError");
const { journalJoiValidator } = require("../../validators");
const APIFeatures = require("../../utils/apiFeatures");


const createJournal = async (body, user) => {
    journalJoiValidator.createJournalSchema(body);
    const journal = new Journal({
        ...body,
        userId: user._id,
    });

    await journal.save();
    return journal;
}

const getJournals = async (query, user) => {
    const features = new APIFeatures(Journal.find({ userId: user._id }), query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const journals = await features.query;
    return journals;
}

const getJournal = async (id, user) => {
    const journal = await Journal.findOne({ _id: id, userId: user._id });
    if (!journal) {
        throw new APIError({
            message: "Journal not found",
            status: 404,
        });
    }
    return journal;
}

const updateJournal = async (id, body, user) => {
    journalJoiValidator.updateJournalSchema(body);
    const journal = await Journal.findOne({ _id: id, userId: user._id });
    if (!journal) {
        throw new APIError({
            message: "Journal not found",
            status: 404,
        });
    }
    Object.assign(journal, body);
    await journal.save();
    return journal;
}

const deleteJournal = async (id, user) => {
    const journal = await Journal.findOne({ _id: id, userId: user._id });
    if (!journal) {
        throw new APIError({
            message: "Journal not found",
            status: 404,
        });
    }
    await journal.deleteOne();
    return { message: "Journal deleted successfully" };
}

module.exports = {
    createJournal,
    getJournals,
    getJournal,
    updateJournal,
    deleteJournal
}

