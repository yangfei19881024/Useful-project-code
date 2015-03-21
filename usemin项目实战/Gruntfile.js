module.exports = function(grunt){

	require("time-grunt")(grunt);
	require("load-grunt-tasks")(grunt);

	var appConfig = {
		dist:"./dist",
		app:"./app"
	}

	grunt.initConfig({

        useminPrepare: {
            html: ['app/tpl/index.html'],
            options: {
                // 测试发现这里指定的dest，是usemin引入资源的相对路径的开始
                // 在usemin中设置assetsDirs，不是指定的相对路径
                // List of directories where we should start to look for revved version of the assets referenced in the currently looked at file
                // root:"app",

                dest: 'build/tpl'               // string type
            }
        },
        usemin: {
            html: ['build/tpl/**/*.html'],      // 注意此处是build/
            options: {
                // assetsDirs: ['build/js','build/css']
                // assetsDirs: ['dist/assets']
            }
        },
        filerev: {
  	      options: {
  	        encoding: 'utf8',
  	        algorithm: 'md5',
  	        length: 12
  	      },
  	      dist: {
  	        src: [
  	          'build/js/*.js',
  	          'build/style/*.css',
  	        ]
  	      }
	    },
        copy: {
            html: {
                expand: true,                   // 需要该参数
                cwd: 'app/',
                src: ['tpl/**/*.html'],         // 会把tpl文件夹+文件复制过去
                dest: 'build'
            }
        }

    });


	 // 最后就是顺序了，没错concat,uglify在这里哦！
  grunt.registerTask('default', [
      'copy:html',
      'useminPrepare',
      'concat:generated',
      'cssmin:generated',
      'uglify:generated',
      'filerev',
      'usemin'
  ]);


}
