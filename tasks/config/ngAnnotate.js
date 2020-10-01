/**
 * `annotate`
 *
 * ---------------------------------------------------------------
 *
 */
module.exports = function (grunt) {

    grunt.config.set('ngAnnotate', {
        dist: {
            options: {
                singleQuotes: true,
            },
            files: {
                '.tmp/public/concat/front/production.js': ['.tmp/public/concat/front/production.js'],
                '.tmp/public/concat/admin/production.js': ['.tmp/public/concat/admin/production.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-ng-annotate');
};
