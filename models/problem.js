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
  },
  like: {
    type:Number,
    default: 0
  }
});


var Problem = module.exports = mongoose.model('Problem',UserSchema);

module.exports.incLike= function(id,callback){
  Problem.findOneAndUpdate({_id:id},{$inc:{like:1}},{new:true},callback);
};

module.exports.decLike= function(id,callback){
  Problem.findOneAndUpdate({_id:id},{$inc:{like:-1}},{new:true},callback);
};
