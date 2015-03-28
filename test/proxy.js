var express = require('express');
var fakeHanaSaml = require('./fakeHanaSamlAuthentication');
var nock = require('nock');
var request = require('supertest');
var rewire = require('rewire');
var should = require('should');
var url = require('url');

var proxy = rewire('./../lib/proxy');
proxy.__set__('hanaSaml', fakeHanaSaml);

// Fixtures
var validCredentials = {
	user: 'validUser',
	password: 'validPw'
};
var invalidCredentials = {
	user: 'invalidUser',
	password: 'invalidPw'
};
var getAuthorizationHeaderValueFromCredentials = function getAuthorizationHeaderValueFromCredentials(credentials) {
	return 'Basic ' + new Buffer(credentials.user + ':' + credentials.password).toString('base64')
};

var middleware;
var app;
var host;
var serviceEndpoint;
var serviceEndpointResponse;
var serviceNock;
var credentials;
var parsedUrl;
var cookie;

describe('proxy', function() {

	beforeEach(function() {
		fakeHanaSaml.reset();
		nock.enableNetConnect('127.0.0.1');
	});

	describe('with host', function() {

		beforeEach(function() {
			host = 'https://hanaxs.ns.ondemand.com';
			parsedUrl = url.parse(host);
			serviceEndpoint = '/account/package/service.xsjs';
			serviceEndpointResponse = 'Hello Service Endpoint';
			cookie = 'yummy!';
			fakeHanaSaml.setCookie(cookie);

			serviceNock = nock(host, {
					reqheaders: {
						'cookie': cookie
					}
				})
				.get(serviceEndpoint)
				.reply(200, serviceEndpointResponse);

			middleware = proxy(host);
			app = express();
			app.use('/', middleware);
		});

		it('should request basic-auth when sending a request for the first time', function(done) {
			request(app)
				.get(serviceEndpoint)
				.expect('WWW-Authenticate', 'Basic realm="' + host + '"')
				.expect(function() {
					fakeHanaSaml.callCount.should.be.exactly(0, 'number of calls to hana saml');
				})
				.expect(401, done);
		});

		it('should authenticate against HCP when provided with basic-auth credentials', function(done) {
			credentials = validCredentials;
			request(app)
				.get(serviceEndpoint)
				.set('Authorization', getAuthorizationHeaderValueFromCredentials(credentials))
				.expect(function() {
					fakeHanaSaml.callCount.should.be.exactly(1, 'number of calls to hana saml');

					var options = fakeHanaSaml.args[0][0];
					options.should.have.a.property('username', credentials.user);
					options.should.have.a.property('password', credentials.password);
					options.should.have.a.property('host', parsedUrl.host);
					options.should.have.a.property('path', serviceEndpoint);

					var callback = fakeHanaSaml.args[0][1];
					callback.should.be.of.type('function');

					serviceNock.done();
				})
				.expect(serviceEndpointResponse)
				.expect(200, function() {
					// Without this anonymous function
					// serviceNock.done() fails for some 
					// strange reason
					done();
				});
		});

	});

});