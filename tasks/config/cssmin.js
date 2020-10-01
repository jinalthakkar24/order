/**
 * Compress CSS files.
 *
 * ---------------------------------------------------------------
 *
 * Minifies css files and places them into .tmp/public/min directory.
 *
 * For usage docs see:
 *        https://github.com/gruntjs/grunt-contrib-cssmin
 */
module.exports = function (grunt) {

    grunt.config.set('cssmin', {
        dist: {
            files: {
                '.tmp/public/min/production-front.min.css': ['.tmp/public/concat/front/production.css'],
                '.tmp/public/min/production-admin.min.css': ['.tmp/public/concat/admin/production.css']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
};
