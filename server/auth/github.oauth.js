'use strict';
var fs = require('fs')
var router = require('express').Router();
var passport = require('passport');
var path = require('path');

var rootPath = path.join(__dirname, '..', '..');
var GitHubStrategy = require('passport-github').Strategy;

var User = require('../api/users/user.model');

router.get('/', passport.authenticate('github'));

router.get('/callback', passport.authenticate('github', {
  successRedirect: '/stories',
  failureRedirect: '/signup'
}));
var githubInfo = fs.readFileSync(rootPath+'/server/auth/secrets.github.txt', 'utf8').split('\n')
passport.use(new GitHubStrategy({
  clientID: githubInfo[0],
  clientSecret: githubInfo[1],
  callbackURL: 'http://127.0.0.1:8080/auth/github/callback'
}, function (token, refreshToken, profile, done) {
  var info = {
    name: profile.displayName,
    // github may not provide an email, if so we'll just fake it
    email: profile.emails ? profile.emails[0].value : [profile.username , 'fake-auther-email.com'].join('@'),
    photo: profile.photos ? profile.photos[0].value : undefined
  };
  User.findOrCreate({
    where: {githubId: profile.id},
    defaults: info
  })
  .spread(function (user) {
    done(null, user);
  })
  .catch(done);
}));

module.exports = router;
