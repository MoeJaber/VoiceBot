var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("../model/videos");
var urlencodedParser = bodyParser.urlencoded({ extended: false })

require('./index');

nickname = global.nickname;
userID = global.userID;

router.get('/upload', function(req, res) {



  if (req.session.user)
{

var videoInfo = new mongoose();
  res.render('upload_video', {
    pageTitle: 'Upload',
    siteTitle: 'Catfish',
    pageID: 'home',
    nickname: nickname,
    userID: userID,
    userSet: true,
      userSession: req.session.user
  });

}
else
{
      console.log("false");
      res.redirect("/");
}

});

router.post('/upload', urlencodedParser, function(req, res) {

  if (global.nickname != null)
{

  // { title: 'asd',
  //     description: 'asdad',
  //     tags: 'catfish',
  //     categoryId: '22',
  //     youtubeId: 'TH9BL5c8MgM',
  //     videoGame: 'wild' },
//console.log(req.body.title);

var videoInfo = new mongoose();

videoInfo.videoTitle = req.body.title;
videoInfo.videoYoutubeId = req.body.youtubeId;
videoInfo.videoAuthor = userID;
videoInfo.videoDesc = req.body.description;
videoInfo.videoCategories = req.body.videoGame;
videoInfo.videoOwner = userID;


console.log("VIDEO OWNER "+ userID);
//console.log(videoInfo.videoTitle + " " + videoInfo.videoYoutubeId+ " " + videoInfo.videoAuthor+ " " + videoInfo.videoDesc+ " " + videoInfo.videoCategories);


videoInfo.save(function(err) {


console.log("error" + err);
});

res.render('upload_video', {
  pageTitle: 'Home',
  siteTitle: 'Upload',
  pageID: 'home',
  nickname: nickname,
  userID: userID,
  userSet: true,
      userSession: req.session.user
});


}
else
{
      console.log("false");
        res.render('index', {
        siteTitle: 'Catfish',
        pageTitle: 'Login'
        });
}


});

module.exports = router;
