var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("../model/users");
var mongooseVideos = require("../model/videos");
var jsonParser = bodyParser.json()
var crypto = require('crypto');

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

router.get('/', function(req, res) {

  console.log("Here:" + req.session.user);

 if (req.session.user)
 {
  res.redirect("/home");
  console.log("redirect sesssion");
 }

  mongoose.model('userlogins').find(function(err, users) {
    res.render('index', {
      pageTitle: 'Home',
      siteTitle: 'Catfish',
      pageID: 'home',
      users: users,
      userSession: req.session.user
    });//end render
  }); //end model


});//end get

router.post('/', urlencodedParser, function (req ,res) {

 
  var response = {};
  var username = req.body.username;
  var pass = req.body.password;


mongoose.find({ 'email': username }, function(err, doc) {

  if (doc.length) {
    

  var user = new mongoose();

  var enc = doc[0].password;
  global.nickname = doc[0].username;
  global.userID = doc[0]._id;

  console.log("Encrypted Password " + pass + " ___ " + enc);

  if(user.validPassword(pass, enc))
  {

    req.session.user = doc;

    console.log("true");
    res.redirect("/home"); //redirects to here after login!
    mongoose.model("videos").find({}, function (err, doc) {
    console.log("------------------------------");
    console.log(doc);

res.render('catfishGallery', {
      userSet : true,
      user: username,
      nickname: global.nickname,
      userID: global.userID,
      siteTitle: 'Catfish',
      pageTitle: 'Gallery',
      videos : doc,
      userSession: req.session.user
    });

    }).sort({"_id" : -1}); //sort by id desc


  }

  else
  {
    console.log("false");
      res.render('index', {
        siteTitle: 'Catfish',
        pageTitle: 'Login'
      });
  }

}//end if doc length

else
 {
    console.log("false");
      res.render('index', {
        siteTitle: 'Catfish',
        pageTitle: 'Login'
      });
  }

});


});

module.exports = router;
