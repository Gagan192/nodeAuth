var express = require('express');
var router = express.Router();
var Problem = require('../models/problem');

/* GET problems listing. */
router.get('/', ensureAuthenticated ,function(req, res, next) {
  res.render('problem',{title:'Discussed'});
});

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login');
}

router.post('/',function(req,res,next){
  var problem= new Problem({
    authId:req.user._id,
    problem:req.body.observation,
    date: new Date
  });
  problem.save(function(err){
    if(err)
      {console.log(err);
        res.render('problem',{title:'Discussed',error:"Unable to save the question"});
      }
    else
      {
        res.render('problem',{title:'Discussed'});
      }
  });
});



module.exports = router;
