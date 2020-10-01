(function () {
    'use strict';
    angular.module('app')
        .directive('setNgAnimate', setNgAnimate);

    /* @ngInject */
    function setNgAnimate($animate) {
        return {
            link: function ($scope, $element, $attrs) {
                $scope.$watch(function () {
                    return $scope.$eval($attrs.setNgAnimate, $scope);
                }, function (valnew, valold) {
                    $animate.enabled(!!valnew, $element);
                });
            }
        };
    }
})();