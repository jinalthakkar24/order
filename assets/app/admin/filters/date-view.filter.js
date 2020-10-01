(function () {
    'use strict';
    /* Filters */
    // need load the moment.js to use this filter.
    angular.module('app')
        .filter('dateView', function ($filter) {
            return function (date) {
                return $filter('date')(date, 'dd/MM/yyyy');
            }
        });
})();