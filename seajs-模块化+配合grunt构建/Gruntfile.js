module.exports = function(grunt){

  require("time-grunt")(grunt);
  require("load-grunt-tasks")(grunt);

  var temp_dir = "./bulid";

  grunt.initConfig({

      transport:{
        options:{
          debug:false,
        },
        transport_seajs:{
          files:[{
            expand:true,
            cwd:"./static/webqq/",
            src:"*.js",
            dest:"./bulid/"
          }]
        }
      },

      concat:{
        concat_file:{
          files:[{
            src:"./bulid/*.js",
            dest:"./dev/main.js",
          }]
        }
      },

      uglify:{
        options:{
          mangle:false,
          beautify:true
        },
        scripts_file:{
          files:[{
            src:"./dev/main.js",
            dest:"./dev/main.min.js"
          }]
        }
      }
  });

  grunt.registerTask('default',
    [
      'transport',
      'concat',
      'uglify'
    ]
  )

}
