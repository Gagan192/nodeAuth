var {mongoose}= require('../db/mongoose');

// User Schema
var UserSchema = mongoose.Schema({
  authId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
  },
  problem: {
    type: String,
    required: true,
    minlength:1,
    trim:true
  },
  discussed: {
    type:Boolean,
    default: false
  },
  active: {
    type:Boolean,
    default: false
  },
  date: {
    type:Date,
  }
});


var Problem = module.exports = mongoose.model('Problem',UserSchema);
