var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressValidator = require('express-validator');
//Handle File uploads
// app.use(multer({dest:'./uploads'}));
var multer = require('multer');
var upload = multer({dest: './uploads'});
var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
//var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle Sessions
app.use(session({
  secret:'secret',
  saveUninitialized: true,
  resave: true
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

// validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value){
    var namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param :formParam,
      msg : msg,
      value : value
    };
  }
}));

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});

app.use('/', routes);
app.use('/users', users);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });



const {generateMessageImpTag} = require('./utils/message');
const {generateMessage} =require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users} = require('./utils/users');

const socketIO = require('socket.io');
const port=process.env.PORT || 3000;
var server = app.listen(port);
var io = socketIO.listen(server);
var users= new Users();

io.on('connection',(socket)=>{
  console.log('New User Connected');

    socket.on('join',(params,callback)=>{
      if(!isRealString(params.name) || !isRealString(params.room)){
        return callback('Name and Room name are required');
      }
      //to join room
      socket.join(params.room);

      users.removeUser(socket.id);
      users.addUser(socket.id,params.name,params.room);
      //io.to(params.room).emit('updateUserList',users.getUserList(params.room));

      socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));
      socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined.`));

      callback();
    });

  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      //Emitting to All That are Connected
      io.to(user.room).emit('newMessage',generateMessageImpTag(user.name,message.text,message.ImpTag));

    }
    callback();

  });

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);

    if(user){
      //io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }
  });
});

module.exports = app;
