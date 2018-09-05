var express = require('express');
var router = express.Router();

router.get('/team', function(req , res) {



res.render('team', {
  pageTitle: 'Catfish',
  siteTitle: 'Team',
  pageID: 'Team',
  nickname: nickname,
  userID: userID,
  userSet: true,
      userSession: req.session.user
});
});

module.exports = router;
