(function () {
    'use strict';
    angular.module('app')
        .directive('uiButterbar', uiButterbar);

    /* @ngInject */
    function uiButterbar($rootScope, $anchorScroll) {
        return {
            restrict: 'AC',
            template: '<span class="bar"></span>',
            link: function (scope, el, attrs) {
                el.addClass('butterbar hide');
                scope.$on('$stateChangeStart', function (event) {
                    $anchorScroll();
                    el.removeClass('hide').addClass('active');
                });
                scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
                    event.targetScope.$watch('$viewContentLoaded', function () {
                        el.addClass('hide').removeClass('active');
                    })
                });
            }
        };
    }
})();