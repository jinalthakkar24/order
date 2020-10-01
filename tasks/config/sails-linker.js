/**
 * Autoinsert script tags (or other filebased tags) in an html file.
 *
 * ---------------------------------------------------------------
 *
 * Automatically inject <script> tags for javascript files and <link> tags
 * for css files.  Also automatically links an output file containing precompiled
 * templates using a <script> tag.
 *
 * For usage docs see:
 *        https://github.com/Zolmeister/grunt-sails-linker
 *
 */
module.exports = function (grunt) {

    grunt.config.set('sails-linker', {
        devFrontVendorJs: {
            options: {
                startTag: '<!--VENDOR SCRIPTS-->',
                endTag: '<!--VENDOR SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/front/front_layout.ejs': require('../pipeline').frontVendorJSFilesToInject
            }
        },
        devFrontJs: {
            options: {
                startTag: '<!--SCRIPTS-->',
                endTag: '<!--SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/front/front_layout.ejs': require('../pipeline').frontJSFilesToInject
            }
        },
        devFrontStyles: {
            options: {
                startTag: '<!--STYLES-->',
                endTag: '<!--STYLES END-->',
                fileTmpl: '<link rel="stylesheet" href="%s">',
                appRoot: '.tmp/public'
            },
            files: {
                'views/front/front_layout.ejs': require('../pipeline').frontCSSFilesToInject
            }
        },
        devAdminVendorJs: {
            options: {
                startTag: '<!--VENDOR SCRIPTS-->',
                endTag: '<!--VENDOR SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/admin/admin_layout.ejs': require('../pipeline').adminVendorJSFilesToInject
            }
        },
        devAdminJs: {
            options: {
                startTag: '<!--SCRIPTS-->',
                endTag: '<!--SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/admin/admin_layout.ejs': require('../pipeline').adminJSFilesToInject
            }
        },
        devAdminStyles: {
            options: {
                startTag: '<!--STYLES-->',
                endTag: '<!--STYLES END-->',
                fileTmpl: '<link rel="stylesheet" href="%s">',
                appRoot: '.tmp/public'
            },
            files: {
                'views/admin/admin_layout.ejs': require('../pipeline').adminCSSFilesToInject
            }
        },
        prodFrontVendorJs: {
            options: {
                startTag: '<!--VENDOR SCRIPTS-->',
                endTag: '<!--VENDOR SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/front/front_layout.ejs': ['.tmp/public/concat/front/vendor.js']
            }
        },
        prodFrontJs: {
            options: {
                startTag: '<!--SCRIPTS-->',
                endTag: '<!--SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/front/front_layout.ejs': ['.tmp/public/min/front/production.min.js']
            }
        },
        prodFrontStyles: {
            options: {
                startTag: '<!--STYLES-->',
                endTag: '<!--STYLES END-->',
                fileTmpl: '<link rel="stylesheet" href="%s">',
                appRoot: '.tmp/public'
            },
            files: {
                'views/front/front_layout.ejs': ['.tmp/public/min/production-front.min.css']
            }
        },
        prodAdminVendorJs: {
            options: {
                startTag: '<!--VENDOR SCRIPTS-->',
                endTag: '<!--VENDOR SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/admin/admin_layout.ejs': ['.tmp/public/concat/admin/vendor.js']
            }
        },
        prodAdminJs: {
            options: {
                startTag: '<!--SCRIPTS-->',
                endTag: '<!--SCRIPTS END-->',
                fileTmpl: '<script src="%s"></script>',
                appRoot: '.tmp/public'
            },
            files: {
                'views/admin/admin_layout.ejs': ['.tmp/public/min/admin/production.min.js']
            }
        },
        prodAdminStyles: {
            options: {
                startTag: '<!--STYLES-->',
                endTag: '<!--STYLES END-->',
                fileTmpl: '<link rel="stylesheet" href="%s">',
                appRoot: '.tmp/public'
            },
            files: {
                'views/admin/admin_layout.ejs': ['.tmp/public/min/production-admin.min.css']
            }
        },
    });

    grunt.loadNpmTasks('grunt-sails-linker');
};
