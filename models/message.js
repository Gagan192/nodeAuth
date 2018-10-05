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
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  ImpTag: {
    type:Boolean,
    required: true
  },
  date: {
    type:String,
    required: true
  }
});


var Message = module.exports = mongoose.model('Message',UserSchema);
