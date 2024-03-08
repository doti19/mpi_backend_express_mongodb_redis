const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const journalSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        default: "",
    },
    content:{
        type: String,
        required: true,
        default: "",
    },
    isFavorite:{
        type: Boolean,
        default: false,
    },
},
    {
        timestamps: true,
      });

    const Journal = mongoose.model("Journal", journalSchema);

    module.exports = Journal;