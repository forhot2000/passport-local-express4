var express = require('express');
var router = express.Router();
var passport = require('passport');

router.use(function(req, res, next) {
  if (req.isAuthenticated()) {
    // console.log('already authenticated.')
    return next();
  }

  // console.log('token auth...')
  return passport.authenticate('token', function(err, user, info) {
    // console.log("authenticate --> ", err, user, info)
    if (err) {
      console.error(err)
      return res.json({ error: err.message }).end();
    }
    if (!user) {
      // console.log('no user')
      return res.json({ error: "Unauthorized." }).end();
    }
    req.logIn(user, { session: false }, function(err) {
      // console.log('login ', user)
      if (err) {
        return res.json({ error: err.message }).end();
      }
      return next();
    });
  })(req, res, next);
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  // console.log(req.user);
  return res.json([req.user]).end();
});

module.exports = router;
