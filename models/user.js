var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/gistcamp');

var userSchema = new mongoose.Schema({
  _id           : String,
  login			    : String,
  id            : Number,
  avatar_url  	: String,
  gravatar_id 	: String,
  url           : String,
  name         	: String,
  company    	  : String,
  blog          : String,
  location      : String,
  email         : String,
  hireable      : Boolean,
  bio           : String,
  public_repos 	: Number,
  public_gists  : Number,
  followers     : Number,
  following     : Number,
  html_url      : String,
  created_at    : String,
  type          : String,  
  access_token  : String,
  tags 			    : 
    [
    	{
      	tag_name : String, 
        gists    : 
          [
            {
             	gist_id: String
            }
          ]
      }                  
    ]
});

module.exports = db.model('user', userSchema);