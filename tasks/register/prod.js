module.exports = function (grunt) {
    grunt.registerTask('prod', [
        'ngconstant:prod',
        'compileAssets',
        'concat',
        'babel',
        'ngAnnotate',
        'uglify',
        'cssmin',
        'sails-linker:prodFrontVendorJs',
        'sails-linker:prodFrontJs',
        'sails-linker:prodFrontStyles',
        'sails-linker:prodAdminVendorJs',
        'sails-linker:prodAdminJs',
        'sails-linker:prodAdminStyles'
    ]);
};
