var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var mongoose = require("../model/users");

var crypto = require('crypto');
var didRegister = false;
var expressValidator = require('express-validator');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(expressValidator());

var urlencodedParser = bodyParser.urlencoded({ extended: false })

//var valid = validator();
// create application/x-www-form-urlencoded parser


router.get('/register', function(req, res) {
  if(!didRegister)
  {
    res.render('register', {
      pageTitle: 'Register',
      siteTitle: 'Catfish',
      pageID: 'register',
      error: false
    });
  console.log("get register");
}
  else
  {
    res.redirect("/");
  }

}); //end get

router.post('/register', urlencodedParser, function (req ,res) {

  var user = new mongoose();
          var response = {};
          // fetch email and password from REST request.
          // Add strict validation when you use this in Production.
          req.checkBody('username','Invalid Username').notEmpty();
          req.checkBody('email','Invalid Email').notEmpty().isEmail();
          req.checkBody('password','Invalid Password').notEmpty().isLength({min:4});
          var errors = req.validationErrors();
          if(errors)
          {
              var messages = [];
              errors.forEach(function(error) {
                messages.push(error.msg);
                console.log(messages);

                res.render('register', {
                  pageTitle: 'Register',
                  pageID: 'register',
                  error: true,
                  messages: messages
                });
              });
          }

          else 
          {


            user.email = req.body.email;
            user.username = req.body.username;

            var pass = user.generateHash(req.body.password);
            console.log(pass);

            user.password = pass ;

            user.save(function(err){
            // save() will run insert() command of MongoDB.
            // it will add new data in collection.
                didRegister = true
        res.redirect("/");
                //res.json(response);
             
            });

        }
}); //end post

module.exports = router;
