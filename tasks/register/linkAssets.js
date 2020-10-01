module.exports = function (grunt) {
    grunt.registerTask('linkAssets', [
        'sails-linker:devFrontJs',
        'sails-linker:devFrontVendorJs',
        'sails-linker:devFrontStyles',
        'sails-linker:devAdminJs',
        'sails-linker:devAdminVendorJs',
        'sails-linker:devAdminStyles',
    ]);
};
