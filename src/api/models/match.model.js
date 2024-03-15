const mongoose = require('mongoose');
const { startingCourse } = require('../../validators/helpers/fields/course.fields');

const matchSchema = new mongoose.Schema({
   playerOne:{
    type: string,
    required: true,
   },
   playerTwo:{
    type: string,
    require: true,
   },
   date:{
    type: Date,
    required: true,
   },
   location:{
    type: String,
    required: true,
   },
   playerOneScore:{
    type: [Number],
    required: true,
   },
   playerTwoScore:{
    type: [Number],
    required: true,
   },
   winner:{
    type: String,
    default: null,
   }});

   matchSchema.pre('/^find/', function(next){
    this.populate({
        path: 'playerOne',
        select: 'firstName lastName avatar'
    })
    .populate({
        path: 'playerTwo',
        select: 'firstName lastName avatar'
    });
    next();
});
const Match = mongoose.model('Match', matchSchema);