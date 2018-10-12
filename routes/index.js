var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var User = require('../models/user');
var Message = require('../models/message');
var Problem = require('../models/problem');

/* GET home page. */
async function parallelExecution(id,token,access){
  const user =  User.findOneAndUpdate({_id:id},{"tokens":[{access,token}]},{new:true})
  const problem = Problem.findOne({active:true,discussed:false},{_id:1,problem:1,like:1});

  try {
    var users = await user
  } catch (e) {
    throw new Error('User not found');
  }

  try {
    var problems = await problem
  } catch (e) {
    throw new Error('Problem not found');
  }

  return{
    user: users,
    problem: problems,
  }
};

router.get('/', ensureAuthenticated ,function(req, res, next) {

  var access = "auth";
  var token = jwt.sign({_id: req.user._id.toHexString(),access},"abc123").toString();
  parallelExecution(req.user._id,token,access).then((doc)=>{

    Message.find({questionId: doc.problem._id},{authId:0,__v:0}, function(err, docs){
      if(err){
          res.render('login', { title: 'Login' , error:"Unable To fetch Previous data on the ProBlem"});
      }else {
        res.render('index', { title: 'Chat | App' , token:doc.user.tokens[0].token,retrieveMessages:docs,question:doc.problem});
      }
      });
    }).catch((e)=>{
      res.render('login', { title: 'Login' , error:e});
    });
  });


// /* GET home page. */
// router.get('/', ensureAuthenticated ,function(req, res, next) {
//   // console.log('I am here to print the id',req.session);
//   // console.log('I am here to print the id',req.user._id);
//   // console.log('I am here to print the id',req.session.passport.user);
// //  User.findById(req.session.passport.user); findOne
// // User.getUserById("5baf808248962361086a445b",function(err,user){
// //     if(err)
// //     console.log(err);
// //
// //     console.log(user);
// //   });
//   var access = "auth";
//   var token = jwt.sign({_id: req.user._id.toHexString(),access},"abc123").toString();
//   User.findOneAndUpdate({_id:req.user._id},{"tokens":[{access,token}]},{new:true},function(err,user){
//       if(err){
//           res.render('login', { title: 'Login' , error:"Login Again"});
//       }else {
//         console.log('Token',user.tokens[0].token);
//         Problem.findOne({active:true,discussed:false},{_id:1,problem:1},function(err,problem){
//           if(err){
//             res.render('login', { title: 'Login' , error:"Unable To fetch the ProBlem"});
//           }else {
//             console.log('question',problem);
//             Message.find({questionId: problem._id},{authId:0,__v:0}, function(err, docs){
//               if(err){
//                   res.render('login', { title: 'Login' , error:"Unable To fetch Previous data on the ProBlem"});
//               }else {
//                 console.log('Messages',docs);
//                 res.render('index', { title: 'Chat | App' , token:user.tokens[0].token,retrieveMessages:docs,question:problem});
//               }
//
//             });
//           }
//         });
//
//       }
//
//     });
//
//   // res.render('index', { title: 'Chat | App' , token:token1});
// });

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}


module.exports = router;
