var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TokenStrategy = require('passport-token').Strategy;
var Account = require('../models/account');

var HOST = "http://" + (process.env.C9_HOSTNAME || "localhost"),
    GOOGLE_CLIENT_ID = "948932287312-33q7h4aoj9po0fijah5bgu3r76evujc2.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET = "R_UruZAc0JNyIQFImbHZ7Kie",
    GOOGLE_CALLBACK_URL = HOST + "/auth/google/callback";

var localStrategy = new LocalStrategy(
  function(username, password, done) {
    console.log("username:", username, "password:", password);
    Account.get(username, function(err, user) {
      if (err) { return done(err); }
      else if (user) { return user.checkPassword(password, done); }
      else { return done(null, false, "username or password error."); }
    });
  }
);

var googleStrategy = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    console.log("google profile:", JSON.stringify(profile, null, 2))
    Account.findOne({ 'accounts.uid': profile.id, 'accounts.provider': 'google' }, function(err, olduser) {

      if(olduser) {
        console.log('Account: ' + olduser.username + ' found and logged in!');
        done(null, olduser);
      } else {
        var newuser = new Account();
        var account = {provider: "google", uid: profile.id};
        newuser.accounts.push(account);
        newuser.username = profile.emails[0].value;
        newuser.email = profile.emails[0].value;

        newuser.save(function(err) {
          if(err) { throw err; }
          console.log('New account: ' + newuser.username + ' created and logged in!');
          done(null, newuser);
        });
        
        // newuser.setPassword('User@123', function(err) {
        //   if (err) {
        //     console.error(err); 
        //     return;
        //   }
        //   newuser.save(function(err) {
        //     if (err) console.error(err);
        //   });
        // });
      }
    });
  }
);

var tokenStrategy = new TokenStrategy(
  function (username, token, done) {
    console.log("username=%s, token=%s", username, token);
    Account.get(username, function(err, user) {
      if (err) { return done(err); }
      else if (user) { return user.checkToken(token, done); }
      else { return done(null, false, "username or token error."); }
    });
  }
);

exports.configure = function() {
  passport.use(localStrategy);
  passport.use(googleStrategy);
  passport.use("token", tokenStrategy);
  passport.serializeUser(function(user, done) {
    console.log("serializeUser:", user)
    done(null, user.username);
  });
  passport.deserializeUser(function(username, done) {
    console.log("deserializeUser:", username)
    Account.get(username, done);
  });
}
