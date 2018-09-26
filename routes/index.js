var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/',function(req, res, next) {
  res.render('index', { title: 'Chat | App' });
});

// router.get('/', ensureAuthenticated,function(req, res, next) {
//   res.render('index', { title: 'Chat | App' });
// });

// function ensureAuthenticated(req,res,next){
//   if(req.isAuthenticated()){
//     return next();
//   }
//   res.redirect('/users/login');
// }

/* Setting Up Sockets and communication*/


module.exports = router;
