'use strict';

const secret = require('../secret/secretFile');

const passport = require('passport');
const User = require('../models/userModel');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user,done) => {
   done(null,user.id);
});

passport.deserializeUser((id,done) => {
   User.findById(id, (err, user) => {
     done(err,user);
   });
});


// passport google
passport.use(new GoogleStrategy({
  clientID : secret.google.clientID,
  clientSecret : secret.google.clientSecret,
  callbackURL : 'http://localhost:3000/auth/google/callback',
  passReqToCallback : true
}, (req, accessToken, refreshToken, profile, done) => {

  User.findOne({google:profile.id}, (err,user) => {
    if(err){
      return done(err);
    }
    if(user){
      done(null,user);
    }else{
      const newUser = new User();
      newUser.google = profile.id;
      newUser.fullName = profile.displayName;
      newUser.email = profile.email;
      newUser.userImage = profile._json.image.url;

      newUser.save((err) => {
        if(err){
          return done(err)
        }else{
          return done(null,newUser);
        }
      })
      }
    });
}));
