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
  },
  like: {
    type:Number,
    default: 0
  }
});


var Message = module.exports = mongoose.model('Message',UserSchema);

module.exports.incLike= function(id,callback){
  Message.findOneAndUpdate({_id:id},{$inc:{like:1}},{new:true},callback);
};

module.exports.decLike= function(id,callback){
  Message.findOneAndUpdate({_id:id},{$inc:{like:-1}},{new:true},callback);
};
