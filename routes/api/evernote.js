var 
	GitHubApi = require('github'),
	config    = require('../../infra/config'),
	request   = require('request'),
	_         = require('lodash'),
	moment    = require('moment'),
    async     = require('async'),
    service   = require('../../infra/service'),
    User      = require('../../models/user'),
    Evernote  = require('evernote').Evernote
;

exports.isEvernoteAuthenticated = function(req, res){
	if(req.session.evernote && req.session.evernote.oauthAccessToken){
		res.send({authenticated: true});
	}else{
		res.send({authenticated: false});
	}
};

exports.saveNote = function(req, res){
	var accessToken = service.getAccessToken(req);
	var gistId = req.param('gist_id');
	if (!gistId) res.send({success:false});
	var gist;

	async.series(
	[
		function(cb){
			// get files of the gist
			var github = service.getGitHubApi(req);
			github.gists.get({id : gistId}, function(err, data){ 
				gist = data;
				cb(null, data); 
			});
		},

		function(cb){
			// get file content and create evernote's note
			if(gist && gist.files) {
				var filesArray = _.toArray(gist.files);

				var getFileContent = function(file, callback){
					request.get({
						url: file.raw_url + '?access_token=' + accessToken,
						timeout: 5000
					}, function(error, response, body){	
						file.file_content = body;
						callback(null);
					});
				};

				var createNote = function(error, result){
					// form note body
					var note = new Evernote.Note();
					note.title = gist.description;
					note.content = '<?xml version="1.0" encoding="UTF-8"?>';
					note.content += '<!DOCTYPE en-note SYSTEM "http://xml.evernote.com/pub/enml2.dtd">';
					note.content += '<en-note>';
					note.content += '<h3>Created from GISTCAMP</h3><br />';
					_.each(filesArray, function(file){
						note.content += '<div style="font-weight:bold;color:blue">' + file.filename + '<br /></div>';
						note.content += '<div>' + file.file_content + '<br /></div>';
					});
					note.content += '</en-note>';

					// save note
					var evernoteInfo = require('../../evernoteInfo').info;
					var client = new Evernote.Client({token: req.session.evernote.oauthAccessToken, sandbox: evernoteInfo.SANDBOX});
					var noteStore = client.getNoteStore();
					noteStore.createNote(note, function(createdNote) {
						cb(null);  
					});
				};

				async.each(filesArray, getFileContent, createNote);
			}
		}	
	],
	function(err, results){
		res.send({success:true});
	});
};

exports.auth = function(req, res) {
	var gistId = req.param('gist_id');

	var evernoteInfo = require('../../evernoteInfo').info;
	var callbackUrl = evernoteInfo.CALLBACU_URL;
	var client = new Evernote.Client({
		consumerKey    : evernoteInfo.API_CONSUMER_KEY,
		consumerSecret : evernoteInfo.API_CONSUMER_SECRET,
		sandbox        : evernoteInfo.SANDBOX
	});

	client.getRequestToken(callbackUrl, function(error, oauthToken, oauthTokenSecret, results){
		if(error) {
			req.session.error = JSON.stringify(error);
			res.redirect('/');
		}
		else { 
			// store the tokens in the session			
			req.session.evernote = {};
			req.session.evernote.oauthToken = oauthToken;
			req.session.evernote.oauthTokenSecret = oauthTokenSecret;

			// redirect the user to authorize the token
			res.redirect(client.getAuthorizeUrl(oauthToken));
		}
	});
};

exports.authCallback = function(req, res) {
	var evernoteInfo = require('../../evernoteInfo').info;
	var client = new Evernote.Client({
		consumerKey    : evernoteInfo.API_CONSUMER_KEY,
		consumerSecret : evernoteInfo.API_CONSUMER_SECRET,
		sandbox        : evernoteInfo.SANDBOX
	});

	client.getAccessToken(
		req.session.evernote.oauthToken, 
		req.session.evernote.oauthTokenSecret, 
		req.param('oauth_verifier'), 
		function(error, oauthAccessToken, oauthAccessTokenSecret, results) {
			if(error) {
				console.log('error');
				console.log(error);
				res.redirect('/');
			} else {
				console.log('success');
				// store the access token in the session
				req.session.evernote.oauthAccessToken = oauthAccessToken;
				req.session.evernote.oauthAccessTtokenSecret = oauthAccessTokenSecret;
				req.session.evernote.edamShard = results.edam_shard;
				req.session.evernote.edamUserId = results.edam_userId;
				req.session.evernote.edamExpires = results.edam_expires;
				req.session.evernote.edamNoteStoreUrl = results.edam_noteStoreUrl;
				req.session.evernote.edamWebApiUrlPrefix = results.edam_webApiUrlPrefix;
				res.redirect('/thanksEvernote');
			}
		}
	);
};
