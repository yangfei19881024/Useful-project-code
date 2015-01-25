module.exports = function(grunt){
	
	grunt.initConfig({
		
		useminPrepare:{
			html:"app/index.html",
			options:{
				dest:"bulid/index.html"
			}
		},
		usemin:{
			html:"bulid/index.html"
		},
		copy:{
			task0:{
				src:"app/index.html",
				dest:"bulid/index.html"
			}
		}
		
	});
	
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-usemin");
	
	
	grunt.registerTask('bulid',[
		'copy:task0',
		'useminprepare',
		'concat',
		'cssmin',
		'uglify',
		'cssmin'
	]);
	
}