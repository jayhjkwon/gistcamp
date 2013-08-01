define(function(require){
	var
		$ = require('jquery'),

		getFileContent = function(file, callback){
			var isMarkdown = false;
			if (file.language && file.language.toLowerCase() === 'markdown'){
				file.isMarkdown = true;
			}

			var xhr =
				$.ajax({
					url: '/api/gist/rawfile',
					data: {file: file.raw_url, isMarkdown: file.isMarkdown}
				}).done(function(result){
					file.file_content = result;
					if (callback)
						callback(null, file);
				});
			
			return xhr;
		}		
	;

	return {
		getFileContent: getFileContent
	};
});