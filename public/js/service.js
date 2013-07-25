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
			  	// callback(result);
			}).always(function(result){
				callback(result);
			});
		},

		getRawFile = function(fileInfo, callback){
			/*$.ajax({
				type: "POST",
			  	url: "/api/gist/rawfile",
			  	data: {file: fileInfo},
			  	dataType: 'json'
			}).done(function(result) {
			  	callback(result);
			});	*/

			/*$.ajax({
				type: "GET",
			  	url: "/api/gist/rawfile",
			  	data: {file: fileInfo.raw_url},
			  	dataType: 'json'
			}).done(function(result) {
			  	callback(result);
			});*/

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