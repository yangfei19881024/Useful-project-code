module.exports = function(grunt){

    require("load-grunt-tasks")(grunt);

    // 项目配置
    grunt.initConfig({
        
        
        autoprefixer:{
            script:{
                files:[{
                    src:"style.css",
                    dest:"style.css",
                }]
            }
        }

    });


    // 默认任务
    grunt.registerTask('default', ['autoprefixer']);
}