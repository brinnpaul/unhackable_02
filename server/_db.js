'use strict';

var Sequelize = require('sequelize');
var fs = require('fs')
var path = require('path');

var rootPath = path.join(__dirname, '..');

var db_password = fs.readFileSync(rootPath+'/server/secretsdatabase.txt', 'utf8').trim()

var db = new Sequelize('auther', 'bpr', db_password, {
  dialect: 'postgres',
  port: 5432,
  define: {
    timestamps: false,
    underscored: true
  }
});


module.exports = db;
