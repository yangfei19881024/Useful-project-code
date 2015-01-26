module.exports = function(grunt){

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var config = {
		'app':'app',
		'dist':'dist'
	};

	grunt.initConfig({
		config:config,
		sass:{
			compile:{
				src:'<%= config.app %>/style.scss',
				dest:'<%= config.dist %>/style.css'
			}
		},

		uglify:{
			options:{
				banner:'/*! grunt jsmin date:<%=grunt.template.today("yyyy-mm-dd")%> */\n'
			},
			compile:{
				expand:true,
				cwd:'<%= config.app %>/js/',
				src:"*.js",
				dest:"<%= config.dist %>/js/",
			},
/*
			compile:{
				expand:true,
				src:"<%= config.app %>/js/*.js",
				dest:"<%= config.dist %>/js/",
			}*/

		},

		clean:{
			clean_task:{
				files:[{
					src:'<%= config.dist%>/**/*',
					filter:function(filepath){
						return (!grunt.file.isDir(filepath))
					}
				}]
			}
		},

		watch:{
			options:{
				livereload:true
			},
			scripts:{
				files:['<%=config.app%>/*.scss','<%= config.app %>/js/*.js'],
				tasks:['sass','uglify']
			}
		},

		express:{
			all:{
				options:{
					port:3000,
					hostname:'localhost',
					bases:'.',
					livereload:true,
				}
			}
		}

	});

	// grunt.loadNpmTasks('grunt-contrib-sass');

	grunt.registerTask('default',['watch']);
	
	grunt.registerTask('jsmin',['uglify:compile']);

	grunt.registerTask('server',['express','watch']);

}
