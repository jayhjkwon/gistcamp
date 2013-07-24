define(function(require){
	var
		$ = require('jquery'),

		getRawFiles = function(filesInfo, callback){
			$.ajax({
				type: "POST",
			  	url: "/api/gist/rawfiles",
			  	data: {files: filesInfo},
			  	dataType: 'json'
			}).done(function(result) {
			  	callback(result);
			});
		},

		getRawFile = function(fileInfo, callback){
			$.ajax({
				type: "POST",
			  	url: "/api/gist/rawfile",
			  	data: {file: fileInfo},
			  	dataType: 'json'
			}).done(function(result) {
			  	callback(result);
			});	
		}
	;

	return {
		getRawFiles : getRawFiles,
		getRawFile  : getRawFile
	}
});