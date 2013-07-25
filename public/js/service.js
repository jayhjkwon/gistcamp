define(function(require){
	var
		$ = require('jquery'),

		getRawFiles = function(filesInfo, callback){
			$.ajax({
				type: "GET",
			  	url: "/api/gist/rawfiles",
			  	data: {files: filesInfo},
			  	dataType: 'json',
			  	// ifModified: false
			}).done(function(result) {
			  	// callback(result);
			}).always(function(result){
				callback(result);
			});
		},

		getRawFile = function(fileInfo, callback){
			$.get('/api/gist/rawfile', {file: fileInfo.raw_url})
			.done(function(data){
				callback(data);
			})
		}
	;

	return {
		getRawFiles : getRawFiles,
		getRawFile  : getRawFile
	}
});