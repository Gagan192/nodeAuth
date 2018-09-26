var moment =require('moment');

var generateMessage = (from,text)=>{
  return{
    from,
    text,
    createdAt: moment().valueOf()
  }
};
var generateMessageImpTag = (from,text,ImpTag)=>{
  return{
    from,
    text,
    createdAt: moment().valueOf(),
    ImpTag
  }
};

module.exports = {generateMessage , generateMessageImpTag};
