var mongoose    =   require("mongoose");
var bcrypt = require('bcrypt');
mongoose.connect('mongodb://localhost:27017/catfishdb',{useMongoClient: true});
mongoose.Promise = global.Promise;
// create instance of Schema
var mongoSchema =   mongoose.Schema;
// create schema
var userSchema  = new mongoSchema({
    "email" : {type: String, required:true, unique: true ,dropDups: true },
    "username" : {type: String, required:true, unique: true ,dropDups: true },
    "password" : {type: String, required:true},
    "videosCreated" : [{type:mongoSchema.ObjectId, ref: 'videos'}]
});




userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password,bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password, enc) {
//console.log("Pass !!!! and ENC " + password + " ___ " + enc);
  return bcrypt.compareSync(password,enc);
}
// create model if not exists.
module.exports = mongoose.model('userlogins',userSchema);
//module.exports = mongoose.model('videos',videoSchema);

// var userLogin = mongoose.model('userLogin',userSchema);
//
// var videos = mongoose.model('videos', videoSchema);
//
// module.export = userLogin;
// module.export = videos;
