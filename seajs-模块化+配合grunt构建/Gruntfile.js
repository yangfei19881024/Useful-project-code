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
            dest:"./dev/app.js",
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
            src:"./dev/app.js",
            dest:"./dev/app.min.js"
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
