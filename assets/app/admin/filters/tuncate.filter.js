(function () {
    'use strict';
    angular.module('app')
        .filter('truncate', truncate);

    /* @ngInject */
    function truncate() {
        return function (text, length) {
            if (text) {
                if (text.length > length) {
                    return text.substr(0, length) + "..";
                }
                return text;
            }
        }
    }
})();