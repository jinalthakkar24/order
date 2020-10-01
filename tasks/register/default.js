module.exports = function (grunt) {
    grunt.registerTask('default', ['ngconstant:dev', 'compileAssets', 'linkAssets']);
};
