'use strict'

module.exports = function(grunt){
	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	var config = {
		app:'app',
		dist:'dist'
	};

	grunt.initConfig({
		config:config,
		
		copy:{
			// dist:{
			// 	src:'<%= config.app%>/index.html',
			// 	dest:'<%= config.dist%>/index.html'
			// }
			dist_html:{
				files:[
					{
						src:'<%= config.app%>/index.html',
						dest:'<%= config.dist%>/index.html'
					},
					{
						src:'<%= config.app%>/js/index.js',
						dest:'<%= config.dist%>/js/index.js',
					}	
				]
			}
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
		}	
	})
}
