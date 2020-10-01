(function () {
    'use strict';
    angular
        .module('app')
        .controller('CodeConvController', CodeConvController)
        .component('codeConv', {
            bindings: {
                ngModel: "=",
                parent: "="
            },
            templateUrl: '/app/admin/components/code-conv/code-conv.html',
            controller: 'CodeConvController as vm'
        });

    /* @ngInject */
    function CodeConvController($scope) {

        var vm = this;
        //data

        //methods
        vm.$onInit = initialize;

        /////////////


        function initialize() {
            $scope.$watch('vm.parent', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    vm.ngModel = _codeConver(newValue);
                }
            });
        }

        function _codeConver(string) {
            if (!string) {
                return '';
            }
            var removedCharString = string.replace(/[^a-zA-Z0-9\s]/g, '');
            removedCharString = removedCharString.trim();
            return removedCharString.replace(/\s+/g, '_').toUpperCase();
        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }
})();