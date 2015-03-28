var basicAuth = require('basic-auth');
var hanaSaml = function() {};
var request = require('request');
var url = require('url')

module.exports = function(host) {

	return function(req, res, next) {
		var credentials = basicAuth(req);

		if (!credentials || !credentials.name || !credentials.pass) {
			return res.status(401)
				.set('WWW-Authenticate', 'Basic realm="' + host + '"')
				.end();
		} else {
			var parsedUrl = url.parse(req.url);
			hanaSaml({
				username: credentials.name,
				password: credentials.pass,
				host: url.parse(host).host,
				path: parsedUrl.path
			}, function(cookie) {
				request({
					url: host + parsedUrl.path,
					headers: {
						'cookie': cookie
					}
				}).pipe(res);
			});
		}
	};
};