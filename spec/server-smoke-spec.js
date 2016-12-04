/*global beforeEach, describe, it, console, afterEach */

var Browser = require('zombie');


describe('Server smoke test', function () {
	'use strict';
	var browser;

	beforeEach(function (done) {
		Browser.localhost('example.com', 3000);
		browser = new Browser();
		browser.visit('/log-in').then(function () {
			return browser.fill('name', 'admin')
				.fill('password', 'admin')
				.pressButton('#log-in');
		}).then(done, done.fail);
	});
	afterEach(function () {
		browser.destroy();
	});
	it('logs the admin in', function () {
		browser.assert.success();
		console.log('logged in as', browser.text('#login-result-name'));
		browser.assert.text('#login-result-name', 'admin');
	});
	describe('Account creation', function () {
		beforeEach(function (done) {
			browser.visit('/util/account').then(done, done.fail);
		});
		describe('account balance', function () {
			beforeEach(function (done) {
				browser.fill('name', 'gojko')
				.fill('amount', 1000)
				.pressButton('#set-up-account')
				.then(done, done.fail);
			});
			it('should set balance', function () {
				browser.assert.success();
				browser.assert.url('/util/account');
				browser.assert.text('#balance', '1000');
				browser.assert.text('#name', 'gojko');
			});
			it('should be able to query balance after setting', function (done) {
				browser.visit('/util/account/gojko').then(function () {
					browser.assert.success();
					browser.assert.text('#balance', '1000');
					browser.assert.text('#name', 'gojko');
				}).then(done, done.fail);
			});
		});
	});
});
