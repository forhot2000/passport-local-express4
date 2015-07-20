var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/google',
    passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile'}));

router.get('/google/callback',
    function(req, res, next) {
        passport.authenticate('google', function(err, user, info){
            if (err) { return res.render('login', { errmsg : err.message }); }
            else if (!user) { return res.render('login', { errmsg : info || "No user bind this google account." }); }
            else { 
                req.logIn(user, function(err) {
                    if (err) { return res.render('login', { errmsg : err.message }); }
                    else { return next(); }
                }); 
            }
        })(req, res, next);
    },
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/');
    });

module.exports = router;
