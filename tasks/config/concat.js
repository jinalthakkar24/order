/**
 * Concatenate files.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [concat](https://github.com/gruntjs/grunt-contrib-concat)
 *
 * For usage docs see:
 *        https://github.com/gruntjs/grunt-contrib-concat
 */
module.exports = function (grunt) {

    grunt.config.set('concat', {
        js: {
            src: require('../pipeline').frontJSFilesToInject,
            dest: '.tmp/public/concat/front/production.js'
        },
        adminJs: {
            src: require('../pipeline').adminJSFilesToInject,
            dest: '.tmp/public/concat/admin/production.js'
        },
        frontVendor: {
            src: require('../pipeline').frontVendorJSFilesToInject,
            dest: '.tmp/public/concat/front/vendor.js'
        },
        adminVendor: {
            src: require('../pipeline').adminVendorJSFilesToInject,
            dest: '.tmp/public/concat/admin/vendor.js'
        },
        css: {
            src: require('../pipeline').frontCSSFilesToInject,
            dest: '.tmp/public/concat/front/production.css'
        },
        adminCss: {
            src: require('../pipeline').adminCSSFilesToInject,
            dest: '.tmp/public/concat/admin/production.css'
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
};
