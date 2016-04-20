var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var multer = require('multer');
var upload = multer();
var router = express.Router();

router.use(function(req, res, next) {
  if(req.user) {
    res.locals.user = req.user;
  }
  return next();
});

router.get('/', function(req, res, next) {
  if(req.user) {
    return res.render('user');
  } else {
    return res.redirect('/');
  }
});

router.get('/register', function(req, res, next) {
  return res.render('register');
});

router.post('/register', upload.array(), function(req, res, next) {
  return Account.register(new Account({
    username: req.body.username,
  }), req.body.password, function(err, account) {
    if (err) {
      req.flash('error', 'Account already exists');
      return res.render('register', {
        errors: req.flash('error')
      });
    }
    return passport.authenticate('local')(req, res, function() {
      return res.redirect('/user/');
    });
  });
});

router.route('/login')
.get(function(req, res) {
  return res.render('login', {errors: req.flash('error')});
})
.post(passport.authenticate('local', {
  failureFlash: true,
  failureRedirect: 'login'
}), function(req, res) {
  return res.redirect('/user');
});

router.get('/logout', function(req, res) {
  req.logout();
  return res.redirect('/');
});

module.exports = router;
