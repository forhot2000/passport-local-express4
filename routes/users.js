var express = require('express');
var router = express.Router();
var passport = require('passport');

/* GET users listing. */
router.get('/', passport.authenticate('token'), function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
