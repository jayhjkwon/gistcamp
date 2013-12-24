var config = {
  "env": process.env.NODE_ENV,
  "perPage": 30,
  "githubHost": "https://api.github.com",
  "GITHUB_CLIENT_ID": "d992e538e78bc563aae8",
  "GITHUB_CLIENT_SECRET": "64a09c87fea5e883c5d432b702876b81f8315e4c",
  "API_CONSUMER_KEY": "outia24-7161",
  "API_CONSUMER_SECRET": "708b26d7fdc6c13b",
  "SANDBOX": true,
  "CALLBACK_URL": "http://localhost:3000/auth/evernote/callback",
  "MONGO_URL": "mongodb://localhost/gistcamp",
  "COOKIE_PARSET_SECRET": "gistcamp",
  "COOKIE_MAX_AGE": 1000 * 60 * 60 * 24 * 30,
  "PORT": process.env.PORT || 3000
};

module.exports = config;
