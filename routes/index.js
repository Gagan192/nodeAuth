var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
var User = require('../models/user');


/* GET home page. */
// router.get('/',function(req, res, next) {
//   res.render('index', { title: 'Chat | App' });
// });

router.get('/', ensureAuthenticated ,function(req, res, next) {
  // console.log('I am here to print the id',req.session);
  // console.log('I am here to print the id',req.user._id);
  // console.log('I am here to print the id',req.session.passport.user);
//  User.findById(req.session.passport.user); findOne
// User.getUserById("5baf808248962361086a445b",function(err,user){
//     if(err)
//     console.log(err);
//
//     console.log(user);
//   });
  var access = "auth";
  var token = jwt.sign({_id: req.user._id.toHexString(),access},"abc123").toString();
  User.findOneAndUpdate({_id:req.user._id},{"tokens":[{access,token}]},{new:true},function(err,user){
      if(err)
      res.render('login', { title: 'Login' , error:"Login Again"});

      // console.log('My Token',user.tokens[0].token);
      res.render('index', { title: 'Chat | App' , token:user.tokens[0].token});
    });

  // res.render('index', { title: 'Chat | App' , token:token1});
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}


module.exports = router;
