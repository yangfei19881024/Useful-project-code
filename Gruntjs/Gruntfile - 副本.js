module.exports = function(grunt){

	grunt.initConfig({

		pkg:grunt.file.readJSON('package.json'),

		uglify:{

			options:{
				banner:'/*! grunt <%= grunt.template.today("dd-mm-yyyy") %>\n*/'
			},

			bulidAll:{
				
				files:[{
					expand: true,
					cwd:'static/**/src/',
					beautify: true
					src:'*.js',
					dist:'static/**/bulid/*.js'
				}]
			}

		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['uglify']);
}