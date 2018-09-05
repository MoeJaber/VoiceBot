var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("../model/videos");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var games = require("../data/covers.json");

require('./index');

nickname = global.nickname;
userID = global.userID;

router.get('/home', function(req, res) {

if (req.session.user)
{

var videoInfo = new mongoose();
  res.render('home', {
    pageTitle: 'Gallery',
    siteTitle: 'Catfish',
    pageID: 'home',
    nickname: nickname,
    userID: userID,
    userSet: true,
    games: games,
    userSession: req.session.user
  });


}
else
{
    res.redirect("/");
}


});




module.exports = router;
