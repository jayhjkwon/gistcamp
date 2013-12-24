define(function(require) {
  var
  Handlebars = require('handlebars'),
    _ = require('underscore'),
    moment = require('moment');

  Handlebars.registerHelper('fromNow', function(time) {
    var value = moment(time).fromNow();

    return value;
  });
});
