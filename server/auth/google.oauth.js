'use strict';

var fs = require('fs')
var router = require('express').Router();
var passport = require('passport');
var path = require('path');

var rootPath = path.join(__dirname, '..', '..');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('google', {
  scope: 'email'
}));

router.get('/callback', passport.authenticate('google', {
  successRedirect: '/stories',
  failureRedirect: '/signup'
}));
var googleInfo = fs.readFileSync(rootPath+'/server/auth/secrets.google.txt', 'utf8').split('\n')
passport.use(new GoogleStrategy({
  clientID: googleInfo[0],
  clientSecret: googleInfo[1],
  callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
}, function (token, refreshToken, profile, done) {
  var info = {
    name: profile.displayName,
    // google may not provide an email, if so we'll just fake it
    email: profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@'),
    photo: profile.photos ? profile.photos[0].value : undefined
  };
  User.findOrCreate({
    where: {googleId: profile.id},
    defaults: info
  })
  .spread(function (user) {
    done(null, user);
  })
  .catch(done);
}));

module.exports = router;
