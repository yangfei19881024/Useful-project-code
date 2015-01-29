module.exports = function(grunt){

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		uglify:{
			compile:{
				src:["app/**/*.js"],
				dest:["dest/**/*.js"]
			}
		}

		jshint:{
			hintjs:["app/**/*.js"]
		}

	});


}