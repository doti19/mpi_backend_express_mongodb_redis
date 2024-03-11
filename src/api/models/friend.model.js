const mongoose = require("mongoose");

const friendshipSchema = mongoose.Schema(
    {
        user1: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Error while sending friend request!"],
        },
        user2: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: [true, "Please select the user you wish to add as a friend!"],
        },

        user1IsBlocked: {
            type: Boolean,
            default: false,
        },
        user2IsBlocked: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            default: "request",
            enum: ["request", "friends"],
        },
        friendRequestSentAt: {
            type: Date,
            default: Date.now(),
        },
        becameFriendsAt: {
            type: String,
            default: Date.now(),
        },
        notification: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

friendshipSchema.pre(/^find/, function (next) {
    this.populate({
        path: "user1",
        select: "firstName lastName isOnline avatar",
    }).populate({
        path: "user2",
        select: "firstName lastName isOnline avatar",
    });
    next();
});

friendshipSchema.methods.toJSON = function () {
    const friendship = this.toObject();

    friendship.id = this._id;
    delete friendship._id;
    delete friendship.__v;
    return friendship;
};

friendshipSchema.index({ user1: 1 });
friendshipSchema.index({ user2: 1 });
const Friendship = mongoose.model("Friendship", friendshipSchema);
module.exports = Friendship;
