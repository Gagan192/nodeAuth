var {mongoose}= require('../db/mongoose');

// User Schema
var UserSchema = mongoose.Schema({
  authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
  },
  questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
  },
  like: {
    type:Boolean,
    default: false
  }
});


var QuestionVote = module.exports = mongoose.model('QuestionVote',UserSchema);
