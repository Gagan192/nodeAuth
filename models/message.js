var {mongoose}= require('../db/mongoose');

// User Schema
var UserSchema = mongoose.Schema({
  authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
  },
  authName: {
    type: String,
    required:true
  },
  message: {
    type: String,
    required: true
  },
  questionId: {
    type: String
  },
  ImpTag: {
    type:Boolean,
    required: true
  },
  date: {
    type:Date,
    required: true
  }
});


var Message = module.exports = mongoose.model('Message',UserSchema);
