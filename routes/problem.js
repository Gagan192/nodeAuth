var express = require('express');
var router = express.Router();
var Problem = require('../models/problem');

/* GET problems listing. */
router.get('/', ensureAuthenticated ,function(req, res, next) {
  Problem.find({active:true},{_id:1,problem:1,discussed:1},function(err,problem){
    if(err){
      res.render('login', { title: 'Login' , error:"Unable To fetch the ProBlems"});
    }else {
      res.render('problem',{title:'Discussed',problem:problem});
    }
  });
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
        res.redirect('/problem');
      }
  });
});

router.get('/admin',function(req, res, next) {
  Problem.find({},function(err,problem){
    if(err){
      res.render('login', { title: 'Login' , error:"Unable To fetch the ProBlems"});
    }else {
      res.render('problem',{title:'Discussed11',problem:problem});
    }
  });
});

router.get('/admin/:id',function(req, res, next) {
  var id= req.params.id;
  Problem.findOneAndUpdate({
    _id:id,
    },
    {$set: {active:true}},{new: true}).then((todo)=>{
      if(!todo){
        return res.redirect('/users/login');
      }
      else {
        return res.redirect('/');
      }
    });
});

router.get('/admin/add/:id',function(req, res, next) {
  var id= req.params.id;
  var problem= new Problem({
    authId:'5baf808248962361086a445b',
    problem:id,
    date: new Date
  });
  problem.save(function(err){
    if(err)
      console.log(err);

      res.redirect('/problem/admin');

    });
});

router.get('/admin/done/:id',function(req, res, next) {
  var id= req.params.id;
  Problem.findOneAndUpdate({
    _id:id,
    },
    {$set: {discussed:true}},{new: true}).then((todo)=>{
      if(!todo){
        return res.redirect('/users/login');
      }
      else {
        return res.redirect('/');
      }
    });
});

module.exports = router;
