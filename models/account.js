// var mongoose = require('mongoose');
// var Schema = mongoose.Schema;
// var passportLocalMongoose = require('passport-local-mongoose');

// var Account = new Schema({
//     username: String,
//     password: String,
//     email: String,
//     accounts: []
// });

// Account.plugin(passportLocalMongoose);

// module.exports = mongoose.model('accounts', Account);

var accounts = [
  { username: "west", email: "west@misfit.com", password: "123", token: "abd123" }
];

var _map = {};

function Account(args) {
  this.username = args.username;
  this.email = args.email;
  this.password = args.password;
  this.token = args.token;
}

Account.prototype.checkToken = function(token, done) {
  var self = this;
  process.nextTick(function(){
    if (self.token === token) {
      return done(null, self);
    } else {
      return done(null, false, "Username or toke error.");
    }
  });
};

Account.prototype.checkPassword = function(password, done) {
  var self = this;
  process.nextTick(function(){
    if (self.password === password) {
      return done(null, self);
    } else {
      return done(null, false, "Username or password error.");
    }
  });
};

Account.get = function(username, cb) {
  process.nextTick(function(){
    cb(null, _map[username.toLowerCase()]);
  });
};

(function(){
  accounts.forEach(function(account) {
    var user = new Account(account);
    _map[user.username.toLowerCase()] = user;
    _map[user.email.toLowerCase()] = user;
  });
}());

module.exports = Account;
