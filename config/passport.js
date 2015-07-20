var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TokenStrategy = require('passport-token').Strategy;
var Account = require('../models/account');


var HOST, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL;
if (process.env.C9_HOSTNAME === "nodejs-tests-forhot2000.c9.io") {
  HOST = "http://" + process.env.C9_HOSTNAME;
  GOOGLE_CLIENT_ID = "948932287312-33q7h4aoj9po0fijah5bgu3r76evujc2.apps.googleusercontent.com";
  GOOGLE_CLIENT_SECRET = "R_UruZAc0JNyIQFImbHZ7Kie";
}
else {
  HOST = "http://localhost:3000";
  GOOGLE_CLIENT_ID = "948932287312-7hriqpb44778sgea9etftksa5ffc1s58.apps.googleusercontent.com";
  GOOGLE_CLIENT_SECRET = "fOPmNK8y2xXw7urdyUVJqJwn";
}
GOOGLE_CALLBACK_URL = HOST + "/auth/google/callback";


var localStrategy = new LocalStrategy(
  function(username, password, done) {
    // console.log("username:", username, "password:", password);
    Account.get(username, function(err, user) {
      if (err) { return done(err); }
      else if (user) { return user.checkPassword(password, done); }
      else { return done(null, false, "Username or password error."); }
    });
  }
);

var googleStrategy = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: GOOGLE_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    // console.log("google profile:", JSON.stringify(profile, null, 2))
    var email = profile.emails[0].value;
    Account.get(email, function(err, user) {
      if (err) { return done(err); }
      else if (user) { return done(null, user); }
      else { return done(null, false, "No user bind this google account."); }
    });
  }
);

var tokenStrategy = new TokenStrategy(
  function (username, token, done) {
    // console.log("username=%s, token=%s", username, token);
    Account.get(username, function(err, user) {
      if (err) { return done(err); }
      else if (user) { return user.checkToken(token, done); }
      else { return done(null, false, "Username or token error."); }
    });
  }
);

exports.configure = function() {
  passport.use(localStrategy);
  passport.use(googleStrategy);
  passport.use("token", tokenStrategy);
  passport.serializeUser(function(user, done) {
    // console.log("serializeUser:", user);
    process.nextTick(function() {
      done(null, user.username);
    })
  });
  passport.deserializeUser(function(username, done) {
    // console.log("deserializeUser:", username);
    Account.get(username, done);
  });
}
