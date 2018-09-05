var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("../model/videos");
var urlencodedParser = bodyParser.urlencoded({ extended: false })

require('./index');

nickname = global.nickname;
userID = global.userID;

router.get('/catfishGallery', function(req, res) {
var id = req.query.id;
var videoInfo = new mongoose();

if (req.session.user)
{

mongoose.model("videos").find({"videoCategories" : id}, function (err, doc) {
console.log("------------------------------");
console.log(doc);




res.render('catfishGallery', {
  pageTitle: 'Gallery',
  siteTitle: 'Catfish',
  pageID: 'home',
  nickname: nickname,
  userID: userID,
  userSet: true,
  videos : doc,
      userSession: req.session.user
});

}).sort({"_id" : -1})
.populate('videoOwner').exec(); //sort by id desc

}
else
{
    	res.redirect("/");
}





});

// router.post('/upload', urlencodedParser, function(req, res) {
//
//   // { title: 'asd',
//   //     description: 'asdad',
//   //     tags: 'catfish',
//   //     categoryId: '22',
//   //     youtubeId: 'TH9BL5c8MgM',
//   //     videoGame: 'wild' },
// console.log(req.body.title);
//
// var videoInfo = new mongoose();
//
// videoInfo.videoTitle = req.body.title;
// videoInfo.videoYoutubeId = req.body.youtubeId;
// videoInfo.videoAuthor = userID;
// videoInfo.videoDesc = req.body.description;
// videoInfo.videoCategories = req.body.videoGame;
//
// console.log(videoInfo.videoTitle + " " + videoInfo.videoYoutubeId+ " " + videoInfo.videoAuthor+ " " + videoInfo.videoDesc+ " " + videoInfo.videoCategories);
//
//
// videoInfo.save(function(err) {
// console.log(err);
// });
//
// res.render('upload_video', {
//   pageTitle: 'Home',
//   siteTitle: 'Upload',
//   pageID: 'home',
//   nickname: nickname,
//   userID: userID,
//   userSet: true
// });
//
//
//
// });

module.exports = router;
