const mongoose = require("mongoose");
const { jwt_token } = require("../../config/config");

const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: jwt_token.refresh.expiresIn,
    },
});

const UserToken = mongoose.model("UserToken", userTokenSchema);

module.exports = UserToken;
