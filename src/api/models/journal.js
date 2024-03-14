const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const journalSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title:{
        type: String,
    },
    content:{
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    ifFavorite:{
        type: Boolean,
        default: false,
    },
});

const Journal = mongoose.model("Journal", journalSchema);