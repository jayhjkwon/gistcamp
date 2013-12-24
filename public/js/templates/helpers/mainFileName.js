define(function(require) {
  var
  Handlebars = require('handlebars'),
    _ = require('underscore');

  Handlebars.registerHelper('mainFileName', function(files) {
    var values = _.values(files);

    if (values.length) {
      return values[0].filename;
    }

    return '';
  });
});
