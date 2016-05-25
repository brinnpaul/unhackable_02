'use strict';

var router = require('express').Router();
var session = require('express-session');
var passport = require('passport');

var User = require('../api/users/user.model');
var fs = require('fs')
var path = require('path');

var rootPath = path.join(__dirname, '..', '..');

router.use(function (req, res, next) {
  var bodyString = '';
  req.on('data', function (chunk) {
    bodyString += chunk;
  });
  req.on('end', function () {
    bodyString = bodyString || '{}';
    req.body = eval('(' + bodyString + ')');
    next();
  });
});

var secret = fs.readFileSync(rootPath+'/server/app/secrets.router.txt', 'utf8').trim()

router.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false
}));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
  .then(function (user) {
    done(null, user);
  })
  .catch(done);
});

router.use(passport.initialize());

router.use(passport.session());

module.exports = router;
