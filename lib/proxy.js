var basicAuth = require('basic-auth');
var hanaSaml = require('hanatrial-auth-proxy');
var request = require('request');
var url = require('url')

module.exports = function(host) {
	var storedCookie;
	return function(req, res, next) {
		var credentials = basicAuth(req);
		var parsedUrl = url.parse(req.url);
		var requestService = function requestService() {
			request({
				url: host + parsedUrl.path,
				headers: {
					'cookie': storedCookie
				}
			}).pipe(res);
		};

		if (!credentials || !credentials.name || !credentials.pass) {
			res.writeHead(401, {
				'WWW-Authenticate': 'Basic realm="' + host + '"'
			});
			return res.end();
		} else if (!storedCookie) {
			hanaSaml({
				username: credentials.name,
				password: credentials.pass,
				host: url.parse(host).host,
				path: parsedUrl.path
			}, function(cookie) {
				storedCookie = cookie;
				requestService();
			});
		} else {
			requestService();
		}
	};
};