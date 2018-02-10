const express = require('express');
const router = express.Router();
const passport = require('passport');

// function for signup validations
function signUpValidation(req,res,next){
  req.checkBody('username','Username is Required').notEmpty();
  req.checkBody('username','Username Must not be less than 4').isLength({min:4});
  req.checkBody('email','Email is Required').notEmpty();
  req.checkBody('email','Email is Required').isEmail();
  req.checkBody('password','Password is Required').notEmpty();
  req.checkBody('password','Password Must not be less than 4').isLength({min:4});

  req.getValidationResult()
  .then((result) => {
    const errors = result.array();
    const messages = [];
    errors.forEach((error) => {
      messages.push(error.msg)
    });
    req.flash('error',messages);
    res.redirect('/signup')
  }).catch((err) => {
    return next();
  })
}

// function for signup validations
function loginValidation(req,res,next){
  req.checkBody('email','Email is Required').notEmpty();
  req.checkBody('email','Email is Required').isEmail();
  req.checkBody('password','Password is Required').notEmpty();
  req.checkBody('password','Password Must not be less than 4').isLength({min:4});

  req.getValidationResult()
  .then((result) => {
    const errors = result.array();
    const messages = [];
    errors.forEach((error) => {
      messages.push(error.msg)
    });
    req.flash('error',messages);
    res.redirect('/')
  }).catch((err) => {
    return next();
  })
}

// get login page
router.get('/', function(req,res){
  const errors = req.flash('error');
  res.render('index',{messages:errors,hasErrors:errors.length > 0});
});

// post login
router.post('/',loginValidation, passport.authenticate('local.login',{
                      successRedirect:'/home',
                      failureRedirect:'/',
                      failureFlash:true
                    }));


// get signup page
router.get('/signup',function(req,res){
    const errors = req.flash('error');
    res.render('signup',{messages:errors,hasErrors:errors.length > 0});
});

// post signup
router.post('/signup',signUpValidation, passport.authenticate('local.signup',{
                      successRedirect:'/home',
                      failureRedirect:'/signup',
                      failureFlash:true
                    }));



// get facebook authentication
router.get('/auth/facebook', passport.authenticate('facebook', {
  scope: 'email'
}));

//facebook callback handle
router.get('/auth/facebook/callback', passport.authenticate('facebook',{
  successRedirect : '/home',
  failureRedirect : '/signup',
  failureFlash : true
}));

// google auth
router.get('/auth/google', passport.authenticate('google',{
  scope:['https://www.googleapis.com/auth/plus.login',
        'https://www.googleapis.com/auth/plus.profile.emails.read']
}));

// google callback handle
router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect : '/home',
  failureRedirect : '/signup',
  failureFlash : true
}));

// get home page
router.get('/home', function(req,res){
  res.render('home');
});





module.exports = router;
