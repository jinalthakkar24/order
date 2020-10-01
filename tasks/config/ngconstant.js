/**
 * `constant`
 *
 * ---------------------------------------------------------------
 *
 */
module.exports = function (grunt) {
    var config = grunt.file.readJSON('assets/app/admin/config.json');
    grunt.config.set('ngconstant', {
        options: {
            name: 'constant',
            dest: 'assets/app/admin/constant/constant.js',
            constants: config.default
        },
        dev: {
            constants: config.development
        },
        prod: {
            constants: config.production
        }
    });
    grunt.loadNpmTasks('grunt-ng-constant');
};
