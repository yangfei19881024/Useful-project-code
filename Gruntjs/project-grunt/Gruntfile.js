module.exports = function(grunt){
	
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);
	
	grunt.initConfig({
		
		config :{ static_dest:'release/main/webapp/static/union/' },
		concat:{
			lib:{
				files:{
					'<%= config.static_dest %>js/build.js':[
						'<%= config.static_dest %>js/zepto.min.js',
						'<%= config.static_dest %>js/slip-min.js'
					]
				}
			}
		},
		
		uglify:{
			options:{
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			my_target:{
				files:[
					{
						expand:true,
						cwd:'<%= config.static_dest %>js/',
						src:'*.js',
						dest:'<%= config.static_dest %>js/'
					}
				]
			}

		},
		
		cssmin:{
			options:{
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
				beautify:{
					ascii_only:true
				}
			},
			my_target:{
				files:[{
					expand:true,
					cwd:'<%= config.static_dest %>css/',
					src:'*.css',
					dest:'<%= config.static_dest %>css/'
				}]
			}
		},
		
		clean:[
			"<%= config.static_dest %>js/zepto.min.js",
			"<%= config.static_dest %>js/slip-min.js"
		],
	});
	
}