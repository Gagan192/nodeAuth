var moment =require('moment');

var generateMessage = (from,text)=>{
  return{
    from,
    text,
    createdAt: moment().valueOf()
  }
};
var generateMessageImpTag = (from,text,ImpTag,messageId)=>{
  return{
    from,
    text,
    createdAt: moment().valueOf(),
    ImpTag,
    messageId
  }
};

var generateTime = ()=>{
  return{
    createdAt: moment().format('h:mm a')
  }
};
module.exports = {generateTime,generateMessage , generateMessageImpTag};
