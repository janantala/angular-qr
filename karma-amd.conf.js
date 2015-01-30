module.exports = function(config) {
  config.set({
    basePath: '',
	files: [
		// set by gulp
	],
    frameworks: ['jasmine', 'requirejs'],
    browsers: [ 'Chrome' ]
  });
};
