var mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/catfishdb',{useMongoClient: true});
mongoose.Promise = global.Promise;

var mongoSchema =   mongoose.Schema;

var videoSchema  = new mongoSchema({
 "videoTitle" : {type: String, required:true},
 "videoYoutubeId" : {type: String, required:true},
 "videoAuthor": {type: String, required:true},
 "videoDesc" : {type: String, required:true},
 "videoCategories": {type: String, required:true},
 "videoOwner": {type:mongoose.Schema.Types.ObjectId, ref: 'userlogins'}

});




module.exports = mongoose.model('videos',videoSchema);

//var user = mongoose.model('userLogin',userSchema);
//module.export = user;
