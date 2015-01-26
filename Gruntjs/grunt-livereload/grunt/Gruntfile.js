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

		/*
		* grunt-contrib-uglify
		* 之前的误操作，本来是想把src 文件下的某一个 js 文件 压缩到 dist相应的目录下，但是 操作 后却是把src下的文件夹 全部
		* 弄到 dest下了【见uglify:compile2】
		*
		* 如果想达到想copy那个文件，或文件夹到 dest目录下 ，就把文件(文件夹) 放到 【uglify:compile 的src下】
		*/

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
			compile2:{
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

		/*
		* grunt-express
		* 目前实现的功能：对sass，uglify 进行实时编译，还有 所有目录下的html文件可以实现无刷新 实时改变
		* bases: . 表示 和 Grunt.js 同一目录
		*/
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
