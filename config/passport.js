var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// passport config
var Account = require('../models/account');

var localStrategy = new LocalStrategy(Account.authenticate());

var googleStrategy = new GoogleStrategy({
    clientID: "948932287312-33q7h4aoj9po0fijah5bgu3r76evujc2.apps.googleusercontent.com",
    clientSecret: "R_UruZAc0JNyIQFImbHZ7Kie",
    callbackURL: "http://25c4629f.ngrok.com/auth/google/callback"
  },
  function(token, tokenSecret, profile, done) {
    console.log("google profile:", JSON.stringify(profile, null, 2))
    Account.find({ 'accounts.uid': profile.id, 'accounts.provider': 'google' }, function(err, olduser) {

      if(olduser._id) {
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
      }
    });
  }
);

exports.configure = function() {
  passport.use(googleStrategy);
  passport.serializeUser(Account.serializeUser());
  passport.deserializeUser(Account.deserializeUser());
}
