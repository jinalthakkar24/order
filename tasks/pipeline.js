/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
let frontCSSFilesToInject = [
    // 'dependencies/**/*.css',
    // "/bower_components/animate.css/animate.css",
    // "/bower_components/font-awesome/css/font-awesome.min.css",
];
let frontVendorJSFilesToInject = [
    // "/bower_components/jquery/dist/jquery.js",
    // "/bower_components/bootstrap/dist/js/bootstrap.js",
    // "/bower_components/angular/angular.js",
    // "/bower_components/angular-animate/angular-animate.js",
    // "/bower_components/angular-aria/angular-aria.js",
    // "/bower_components/angular-cookies/angular-cookies.js",
    // "/bower_components/angular-messages/angular-messages.js",
    // "/bower_components/angular-resource/angular-resource.js",
    // "/bower_components/angular-sanitize/angular-sanitize.js",
    // "/bower_components/angular-touch/angular-touch.js",
];
let frontJSFilesToInject = [
    // 'js/**/*.js',
    // 'app/front/**/module.js',
    // 'app/front/**/*.js',
];
let adminVendorJSFilesToInject = [
    "/bower_components/jquery/dist/jquery.js",
    "/bower_components/bootstrap/dist/js/bootstrap.js",
    "/bower_components/angular/angular.js",
    "/bower_components/angular-animate/angular-animate.js",
    "/bower_components/angular-aria/angular-aria.js",
    "/bower_components/angular-cookies/angular-cookies.js",
    "/bower_components/angular-messages/angular-messages.js",
    "/bower_components/angular-resource/angular-resource.js",
    "/bower_components/angular-sanitize/angular-sanitize.js",
    "/bower_components/angular-touch/angular-touch.js",
    "/bower_components/angular-ui-router/release/angular-ui-router.js",
    "/bower_components/angular-ui-notification/dist/angular-ui-notification.js",
    "/bower_components/angular-ui-select/dist/select.js",
    "/bower_components/ngstorage/ngStorage.js",
    "/bower_components/ng-sortable/dist/ng-sortable.min.js",
    "/bower_components/angular-ui-utils/ui-utils.js",
    "/bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.js",
    "/bower_components/moment/min/moment.min.js",
    "/bower_components/angular-block-ui/dist/angular-block-ui.min.js",
    "/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
    "/bower_components/oclazyload/dist/ocLazyLoad.js",
    "/bower_components/underscore/underscore-min.js",
    "/bower_components/angular-filter/dist/angular-filter.min.js",
    "/bower_components/angular-avatar/dist/angular-avatar.min.js",
    "/bower_components/magnific-popup/dist/jquery.magnific-popup.min.js",
    "/bower_components/intl-tel-input/build/js/intlTelInput.js",
    "/bower_components/intl-tel-input/build/js/utils.js",
    "/bower_components/ng-intl-tel-input/dist/ng-intl-tel-input.min.js",
];
let adminCSSFilesToInject = [
    // Bring in `.css` files for themes and style guides (e.g. Bootstrap, Foundation)
    'dependencies/**/*.css',
    "/bower_components/animate.css/animate.css",
    "/bower_components/font-awesome/css/font-awesome.min.css",
    "/bower_components/simple-line-icons/css/simple-line-icons.css",
    "/bower_components/bootstrap/dist/css/bootstrap.css",
    "/bower_components/angular-ui-notification/dist/angular-ui-notification.css  ",
    "/bower_components/ng-sortable/dist/ng-sortable.min.css",
    "/bower_components/angular-ui-bootstrap-datetimepicker/datetimepicker.css",
    "/bower_components/angular-ui-select/dist/select.css",
    "/bower_components/angular-block-ui/dist/angular-block-ui.min.css",
    "/bower_components/magnific-popup/dist/magnific-popup.css",
    "/bower_components/intl-tel-input/build/css/intlTelInput.css",
    // All of the rest of your custom `.css` files will be injected here,
    // in no particular order.  To customize the ordering, add additional
    // items here, _above_ this one.
    'css/*.css'
];

let adminJSFilesToInject = [
    // All of the rest of your custom client-side js files will be injected here,
    // in no particular order.  To customize the ordering, add additional items
    // here, _above_ this one.
    'js/**/*.js',
    'app/admin/**/module.js',
    'app/admin/**/*.js',
];


// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.frontCSSFilesToInject = frontCSSFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});
module.exports.frontJSFilesToInject = frontJSFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});
module.exports.frontVendorJSFilesToInject = frontVendorJSFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});
module.exports.adminCSSFilesToInject = adminCSSFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});
module.exports.adminJSFilesToInject = adminJSFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});
module.exports.adminVendorJSFilesToInject = adminVendorJSFilesToInject.map(function (path) {
    return '.tmp/public/' + path;
});