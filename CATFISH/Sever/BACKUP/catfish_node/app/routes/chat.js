var express = require('express');
var router = express.Router();

router.get('/chat', function(req, res) {

if (req.session.user)
{

  res.render('chat', {
    pageTitle: 'Catfish - Chat',
    pageID: 'chat',
    nickname: global.nickname,
    userSession: req.session.user
  });

  }
else
{
    res.redirect("/");
}

});

module.exports = router;
