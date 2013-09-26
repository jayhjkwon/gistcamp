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

  setTagOnGist= function(tagId, gistId){
    var xhr =
    $.ajax({
      type: 'PUT',
      url: '/api/gist/tagged/' + tagId + '/' + gistId
    });
    
    return xhr; 
  },

  deleteTagOnGist= function(tagId, gistId){
    var xhr =
    $.ajax({
      type: 'DELETE',
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

  setShared = function(gistId, users){
    var xhr =
    $.ajax({
      type: 'POST',
      url: '/api/gist/shared/' + gistId + '/' + users
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
  },

  deleteStar = function(gistId){
    var xhr =
    $.ajax({
      type: 'DELETE',
      url: '/api/gist/star/' + gistId
    });
    
    return xhr; 
  },

  isEvernoteAuthenticated = function(){
    var xhr =
    $.ajax({
      type: 'GET',
      url: '/api/evernote/is_authenticated'
    });
    
    return xhr;
  },

  saveNote = function(gistId){
    var xhr =
    $.ajax({
      type: 'POST',
      url: '/api/evernote/save/' + gistId
    });
    
    return xhr;   
  }   
  ;

  return {
    getFileContent   : getFileContent,
    setTagOnGist     : setTagOnGist,
    deleteTagOnGist  : deleteTagOnGist,
    getServerOptions : getServerOptions,
    setStar          : setStar,
    deleteStar       : deleteStar,
    setShared        : setShared,
    isEvernoteAuthenticated : isEvernoteAuthenticated,
    saveNote         : saveNote
  };
});