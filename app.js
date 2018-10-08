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
const jwt = require('jsonwebtoken');

var routes = require('./routes/index');
var users = require('./routes/users');
var problem = require('./routes/problem');

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
app.use('/problem', problem);

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


const {generateTime} = require('./utils/message');
const {generateMessageImpTag} = require('./utils/message');
const {generateMessage} =require('./utils/message');
const {isRealString}=require('./utils/validation');
const {Users} = require('./utils/users');
var User = require('./models/user');
var Message = require('./models/message');
var Vote = require('./models/vote');

const socketIO = require('socket.io');
const port=process.env.PORT || 3000;
var server = app.listen(port);
var io = socketIO.listen(server);
var users= new Users();

io.on('connection',(socket)=>{

    socket.on('join',(params,callback)=>{
      // if(!isRealString(params.name) || !isRealString(params.room)){
      //   return callback('Name and Room name are required');
      // }
      //to join room
      var decoded;
      try{
        decoded = jwt.verify(params.token,'abc123');
      }catch(e){
        return callback('Authenticatin Failed.Token not matched. Relogin');
        }
        User.findOne({_id:decoded._id},function(err,user){
            if(err)
            callback(err);

            socket.join(params.questionId);

            users.removeUser(socket.id);
            users.addUser(socket.id,user.name,decoded._id,params.questionId);
            //io.to(params.room).emit('updateUserList',users.getUserList(params.room));


            socket.emit('newMessage', generateMessage('Admin','Welcome to the World Of Innovation'));
            // socket.broadcast.to(params.questionId).emit('newMessage',generateMessage('Admin',`${user.name} has joined.`));

            callback();
        });

    });

  socket.on('createMessage',(message,callback)=>{
    var user = users.getUser(socket.id);

    if(user && isRealString(message.text)){
      //Saving The Message data
      var createdTime= generateTime();
      var newMessage = new Message({
        authId: user.authId,
        authName: user.name,
        message: message.text,
        ImpTag:message.ImpTag,
        questionId: user.questionId,
        date: createdTime.createdAt
      });

      newMessage.save(function (err,doc) {
        if (err) return console.log("Unable To save the Message");

        //Emitting to All That are Connected
        io.to(user.questionId).emit('newMessage',generateMessageImpTag(user.name,message.text,message.ImpTag,doc._id));
        callback();
        })
    }else {
      callback();
    }

  });

  socket.on('upvote',(upvote,callback)=>{

    var user = users.getUser(socket.id);
    if(user){
      Vote.findOne({authId:user.authId,messageId:upvote.upvoteId},function(err,voteStatus){
        if(err) callback();

        if(voteStatus){
            Vote.findOneAndUpdate({_id:voteStatus._id},{"like":!voteStatus.like,"unlike":false},{new:true},function(err){
              if(err) callback();
              if(voteStatus.like){
                Message.decLike(upvote.upvoteId,function(err,message){
                  // console.log('Message',message);
                  if(message){
                    io.to(user.questionId).emit('updateVote',message.like,message._id);
                  }
                  callback();
                });
              }else {
                if(voteStatus.unlike){
                  Message.incLikeDecUnlike(upvote.upvoteId,function(err,message){
                    // console.log('Message',message);
                    if(message){
                      io.to(user.questionId).emit('updateIncLikeDecUnlike',message.like,message.unlike,message._id);
                    }
                    callback();
                  });
                }else {
                  Message.incLike(upvote.upvoteId,function(err,message){
                    // console.log('Message',message);
                    if(message){
                      io.to(user.questionId).emit('updateVote',message.like,message._id);
                    }
                    callback();
                  });
                }
              }
          });
        }else {
          var upVote = new Vote({
            authId: user.authId,
            messageId: upvote.upvoteId,
            like:true
          });
          Message.incLike(upvote.upvoteId,function(err,message){
            // console.log('Message',message);
            if(message){
              upVote.save(function(err){
                if(err) callback();
              io.to(user.questionId).emit('updateVote',message.like,message._id);
              });
            }
            callback();
          });
        }
      });
    }
  });

  socket.on('downvote',(downvote,callback)=>{

    var user = users.getUser(socket.id);
    if(user){
      Vote.findOne({authId:user.authId,messageId:downvote.downvoteId},function(err,voteStatus){
        if(err) callback();

        if(voteStatus){
            Vote.findOneAndUpdate({_id:voteStatus._id},{"unlike":!voteStatus.unlike,"like":false},{new:true},function(err){
              if(err) callback();
              if(voteStatus.unlike){
                Message.decUnlike(downvote.downvoteId,function(err,message){
                  // console.log('Message',message);
                  if(message){
                    io.to(user.questionId).emit('updateDownvote',message.unlike,message._id);
                  }
                  callback();
                });
              }else {
                if(voteStatus.like){
                  Message.incUnlikeDecLike(downvote.downvoteId,function(err,message){
                    // console.log('Message',message);
                    if(message){
                      io.to(user.questionId).emit('updateIncUnlikeDecLike',message.like,message.unlike,message._id);
                    }
                    callback();
                  });
                }else {
                  Message.incUnlike(downvote.downvoteId,function(err,message){
                    // console.log('Message',message);
                    if(message){
                      io.to(user.questionId).emit('updateDownvote',message.unlike,message._id);
                    }
                    callback();
                  });
                }
              }
          });
        }else {
          var downVote = new Vote({
            authId: user.authId,
            messageId: downvote.downvoteId,
            unlike:true
          });
          Message.incUnlike(downvote.downvoteId,function(err,message){
            // console.log('Message',message);
            if(message){
              downVote.save(function(err){
                if(err) callback();
              io.to(user.questionId).emit('updateDownvote',message.unlike,message._id);
              });
            }
            callback();
          });
        }
      });
    }
  });

  socket.on('disconnect',()=>{
    var user = users.removeUser(socket.id);

    if(user){
      //io.to(user.room).emit('updateUserList',users.getUserList(user.room));
      // io.to(user.questionId).emit('newMessage',generateMessage('Admin',`${user.name} has left.`));
    }
  });
});

module.exports = app;
