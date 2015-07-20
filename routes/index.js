var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

router.get('/register', function(req, res) {
    res.render('register', { });
});

router.post('/register', function(req, res) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render("register", {info: "Sorry. That username already exists. Try again."});
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', 
    function(req, res, next) {
        passport.authenticate('local', function(err, user, info){
            if (err) { return res.render('login', { errmsg : err.message }); }
            else if (!user) { return res.render('login', { errmsg : info || "Username or password error." }); }
            else { 
                req.logIn(user, function(err) {
                    if (err) { return res.render('login', { errmsg : err.message }); }
                    else { return next(); }
                }); 
            }
        })(req, res, next);
    },
    function(req, res) {
        res.redirect('/');
    }
);

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function(req, res){
    res.status(200).send("pong!");
});

router.use(function(req, res, next) {
    if (req.isAuthenticated()) { next(); }
    else { res.redirect("/login"); }
});

router.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

module.exports = {
    index: router,
    users: require('./users'),
    auth: require('./auth')
};
