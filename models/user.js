var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/gistcamp');

var userSchema = new mongoose.Schema({
  _id               : String, // same as login
  login			        : String,
  id                : Number,
  avatar_url  	    : String,
  gravatar_id 	    : String,
  url               : String,
  html_url          : String,
  followers_url     : String,
  following_url     : String,
  gists_url         : String,
  starred_url       : String,
  subscriptions_url : String,
  organizations_url : String,
  repos_url         : String,
  events_url        : String,
  received_events_url: String,
  type              : String,  
  name             	: String,
  company    	      : String,
  blog              : String,
  location          : String,
  email             : String,
  hireable          : Boolean,
  bio               : String,
  public_repos 	    : Number,  
  followers         : Number,
  following         : Number,  
  created_at        : String,
  updated_at        : String,
  public_gists      : Number,
  access_token      : String,
  tags 			        : 
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