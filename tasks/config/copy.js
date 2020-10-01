/**
 * Copy files and folders.
 *
 * ---------------------------------------------------------------
 *
 * # dev task config
 * Copies all directories and files, exept coffescript and less fiels, from the sails
 * assets folder into the .tmp/public directory.
 *
 * # build task config
 * Copies all directories nd files from the .tmp/public directory into a www directory.
 *
 * For usage docs see:
 *        https://github.com/gruntjs/grunt-contrib-copy
 */
module.exports = function (grunt) {

    grunt.config.set('copy', {
        dev: {
            files: [
                {//copy other assets
                    expand: true,
                    cwd: './assets',
                    src: ['**/*.!(coffee|less)'],
                    dest: '.tmp/public'
                },
                {//copy bootstrap glyphicons fonts
                    expand: true,
                    cwd: './assets/bower_components/bootstrap/dist/fonts',
                    src: ['**/*.!(coffee|less)'],
                    dest: '.tmp/public/fonts'
                },
                {//copy bootstrap simple-line-icons fonts
                    expand: true,
                    cwd: './assets/bower_components/simple-line-icons/fonts/',
                    src: ['**/*.!(coffee|less)'],
                    dest: '.tmp/public/fonts'
                }
            ]
        },
        build: {
            files: [{
                expand: true,
                cwd: '.tmp/public',
                src: ['**/*'],
                dest: 'www'
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
};
