/**
 * `es6 compile via babel`
 *
 * ---------------------------------------------------------------
 *
 */
module.exports = function (grunt) {

    grunt.config.set('babel', {
        dist: {
            options: {
                sourceMap: true,
                presets: ['env']
            },
            files: {
                '.tmp/public/concat/front/production.js': ['.tmp/public/concat/front/production.js'],
                '.tmp/public/concat/admin/production.js': ['.tmp/public/concat/admin/production.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
};
