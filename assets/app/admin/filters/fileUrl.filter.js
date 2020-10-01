(function () {
    'use strict';
    /* Filters */
    // need load the moment.js to use this filter.
    angular.module('app')
        .filter('fileUrlFilter', function ($location) {
            return function (imagePath, noImage) {
                var baseUrl = $location.$$protocol + '://' + $location.$$host+':'+$location.$$port;
                if (!imagePath || imagePath == "") {//if no image available
                    return baseUrl + noImage;
                }
                if (imagePath.indexOf('https://') !== -1) {
                    return imagePath;
                }
                return baseUrl + imagePath;
            }
        });
})();