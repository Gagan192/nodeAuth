var {mongoose}= require('../db/mongoose');

// User Schema
var UserSchema = mongoose.Schema({
  authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
  },
  messageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
  },
  like: {
    type:Boolean,
    default: false
  },
  unlike: {
    type:Boolean,
    default: false
  }
});


var Vote = module.exports = mongoose.model('Vote',UserSchema);
