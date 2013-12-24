var
GitHubApi = require('github');

var github = new GitHubApi({
  version: '3.0.0'
});

var authenticate = function(req) {
  github.authenticate({
    type: 'oauth',
    token: req.user.access_token
  });
};

var authenticateByAccessToken = function(accessToken) {
  github.authenticate({
    type: 'oauth',
    token: accessToken
  });
};

exports.getGitHubApi = function(req) {
  authenticate(req);
  return github;
};

exports.getGitHubApiByAccessToken = function(accessToken) {
  authenticateByAccessToken(accessToken);
  return github;
};

// this function is intend to be used after authentication
exports.getAccessToken = function(req) {
  if (req && req.user)
    return req.user.access_token;
  return null;
};

exports.getUserId = function(req) {
  return req.user.id;
};

// this function is intend to be used after authentication
exports.getLoginName = function(req) {
  return req.user.login;
};
