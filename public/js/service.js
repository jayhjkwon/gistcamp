define(function(require){
	var
		$        = require('jquery'),
		markdown = require('markdown'),

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
					if (file.isMarkdown)
						file.file_content = markdown.toHTML(result);
					else
						file.file_content = result;
					
					if (callback)
						callback(null, file);
				});
			
			return xhr;
		},

		editTagGist= function(tagId, gistId){
			var xhr =
				$.ajax({
					type: 'PUT',
					url: '/api/gist/tagged/' + tagId + '/' + gistId
				});
			
			return xhr;	
		},

		getServerOptions = function(){
			var xhr =
				$.ajax({
					type: 'GET',
					url: '/api/server/options'
				});
			
			return xhr;
		},

		setStar = function(gistId){
			var xhr =
				$.ajax({
					type: 'POST',
					url: '/api/gist/star/' + gistId
				});
			
			return xhr;	
		}		
	;

	return {
		getFileContent   : getFileContent,
		editTagGist      : editTagGist,
		getServerOptions : getServerOptions,
		setStar          : setStar
	};
});