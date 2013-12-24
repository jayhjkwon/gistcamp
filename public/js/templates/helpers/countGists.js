define(function(require) {
  var
  Handlebars = require('handlebars'),
    _ = require('underscore');

  Handlebars.registerHelper('countGists', function(items, options) {
    return items.length;
  });
});
