/**
 * Minify files with UglifyJS.
 *
 * ---------------------------------------------------------------
 *
 * Minifies client-side javascript `assets`.
 *
 * For usage docs see:
 *        https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function (grunt) {

    grunt.config.set('uglify', {
        dist: {
            files: {
                '.tmp/public/min/front/production.min.js': ['.tmp/public/concat/front/production.js'],
                '.tmp/public/min/admin/production.min.js': ['.tmp/public/concat/admin/production.js']
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
};
