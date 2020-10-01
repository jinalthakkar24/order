(function () {
    'use strict';
    angular
        .module('app')
        .directive('updateTitle', updateTitle);

    /* @ngInject */
    function updateTitle($transitions, Modules) {
        return {
            link: function (scope, element) {
                $transitions.onStart({}, function ($transition) {
                    _.each(Modules, function (value, key) {
                        if ($transition.$to().name === key) {
                            angular.element('title').html(value.title)
                        }
                    });
                });
            }
        };
    }
})();