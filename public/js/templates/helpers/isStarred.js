define(function(require) {
  var
  Handlebars = require('handlebars'),
    _ = require('underscore'),
    global = require('global');

  Handlebars.registerHelper('isStarred', function(isStarred, options) {
    if (isStarred) {
      return '<i class="is-starred icon-star"></i>';
    } else {
      return '';
    }
  });
});
