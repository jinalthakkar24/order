(function () {
    'use strict';

    angular
        .module('app')
        .service('LocalStorageService', LocalStorageService);


    /* @ngInject */
    function LocalStorageService($localStorage) {
        return {
            set: function (key, value) {
                $localStorage[key] = JSON.stringify(value);
            },
            get: function (key) {
                return $localStorage[key] ? JSON.parse($localStorage[key]) : {};
            },
            clear: function (key) {
                delete $localStorage[key];
            }
        }
    }
})();