var
mongoose = require('mongoose'),
  config;

if (process.env.NODE_ENV === 'production') {
  config = require('./config');
} else {
  config = require('./config-dev');
}

exports.getMongoConnection = function() {

  var opts = {
    server: {
      auto_reconnect: true,
      poolSize: 10
    }
  };

  var db = mongoose.createConnection(config.MONGO_URL, opts);

  return db;
}
