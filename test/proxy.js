var express = require('express');
var request = require('supertest');
var proxy = require('./../lib/proxy');

var middleware;
var app;
var host;
var serviceEndpoint;

describe('proxy', function() {

	describe('with host', function() {

		beforeEach(function() {
			host = 'https://hanaxs.ns.ondemand.com';
			serviceEndpoint = '/account/package/service.xsjs'
			middleware = proxy(host);
			app = express();
			app.use('/', middleware);
		});

		it('should request basic-auth when sending a request for the first time', function(done) {
			request(app)
				.get(serviceEndpoint)
				.expect('WWW-Authenticate', 'Basic realm="' + host + '"')
				.expect(401, done);
		});

	});

});