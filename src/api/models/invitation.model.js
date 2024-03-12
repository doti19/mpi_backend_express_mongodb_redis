const mongoose = require("mongoose");
const { token } = require("../../config/config");

const Schema = mongoose.Schema;

const invitationSchema = new Schema({
    inviterId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    rel:{
        type: String,
        required: true,
        enum: ["parent", "child", "player", "coach", "join"],
    },
    
    invitedEmail: {
        type: String,
        required: true,
        ref: "User",
    },
    token: {
        type: String,
        required: true,
        index: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: { expires: token.invitationExpirationSeconds },
    },
});

const Invitation = mongoose.model("Invitation", invitationSchema);

module.exports = Invitation;
