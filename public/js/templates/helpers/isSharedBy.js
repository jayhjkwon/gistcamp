define(function(require) {
  var
  Handlebars = require('handlebars'),
    _ = require('underscore'),
    global = require('global');

  Handlebars.registerHelper('isSharedBy', function(isSharedBy, options)  {
    if (isSharedBy) {
      return '<div class="subtitle">Shared by ' + isSharedBy  + '</div>';
    } else {
      return '';
    }
  });
});
