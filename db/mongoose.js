var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/ChatApp');
mongoose.connect('mongodb://gagan192:gagan192@ds221003.mlab.com:21003/chat_app');

module.exports={mongoose};
