'use strict';

const passport = require('passport');
const User = require('../models/userModel');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done) => {
   done(null,user.id);
});

passport.deserializeUser((id,done) => {
   User.findById(id, (err, user) => {
     done(err,user);
   });
});


// passport to check signup
passport.use('local.signup', new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
}, (req, email, password, done) => {

  User.findOne({'email':email}, (err,user) => {
    if(err){
      return done(err);
    }
    if(user){
      return done(err,false, req.flash('error', 'User with this email already exists'))
    }
    else{
      const newUser = new User();
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = newUser.encryptPassword(req.body.password);

      newUser.save((err) => {
        console.log(err);
        done(null,newUser);
      });
    }
  });
}));


// passport to check login
passport.use('local.login', new LocalStrategy({
  usernameField:'email',
  passwordField:'password',
  passReqToCallback:true
}, (req, email, password, done) => {

  User.findOne({'email':email}, (err,user) => {
    if(err){
      return done(err);
    }

    const messages = [];
    if(!user || !user.comparePassword(password)){
      messages.push('Email Does not exists or password is invalid');
      return done(null,false,req.flash('error',messages));
    }

    return done(null,user);

  });
}));
