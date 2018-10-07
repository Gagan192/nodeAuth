var express = require('express');
const jwt = require('jsonwebtoken');
var User = require('../models/user');
var Message = require('../models/message');
var Problem = require('../models/problem');

  async function parallelExecution(id,token,access){
    const user =  User.findOneAndUpdate({_id:id + '1'},{"tokens":[{access,token}]},{new:true})
    const problem = Problem.findOne({active:true,discussed:false},{_id:1,problem:1});

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

    var id='5bb5b13c9ff2ff849437b48b';
    var access = "auth";
    var token = jwt.sign({_id:id,access},"abc123").toString();
    parallelExecution(id,token,access).then((doc)=>{

      Message.find({questionId: doc.problem._id },{authId:0,__v:0}, function(err, docs){
        if(err){
          console.log(err);
          //  res.render('login', { title: 'Login' , error:"Unable To fetch Previous data on the ProBlem"});
        }else {
          console.log('Am i Executing');
          //console.log('Messages',docs);
        //  res.render('index', { title: 'Chat | App' , token:doc.user.tokens[0].token,retrieveMessages:docs,question:doc.problem});
        }

        });
      }).catch((e)=>{
        console.log('This is a handeled ',e);
      });
