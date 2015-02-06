/* global requirejs */
'use strict';
var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/spec\.js$/i.test(file)) {
      tests.push(file);
    }
  }
}

requirejs.config({
	// Karma serves files from '/base'
	baseUrl: '/base/',

	paths: {
		'angular': 'bower_components/angular/angular',
		'angular-mocks': 'bower_components/angular-mocks/angular-mocks',
		'QRCode': 'bower_components/qrcode/lib/qrcode',
	},

	shim: {
		'angular': {
			exports: 'angular'
		},
		'angular-mocks' : {
			exports: 'angular.mock',
			deps: ['angular'],
		},
		'/base/test/unit.spec.js' : {
			deps: ['angular-mocks']
		}
	},

	// ask Require.js to load these files (all our tests)
	deps: tests,
	// start test run, once Require.js is done
	callback: window.__karma__.start
});
