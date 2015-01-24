module.exports = function(grunt){

  grunt.initConfig({
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'static/',
          src: ['**/*.scss','!bulid/','!style/'],
          dest: 'public/',
          ext: '.css'
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  
  grunt.registerTask('default',['sass']);

}