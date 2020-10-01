(function () {
    'use strict';
    angular
        .module('app')
        .controller('ActionButtonsController', ActionButtonsController)
        .component('actionButtons', {
            bindings: {
                hasTypePermission:'<',
                hasTypeModule:'<',

                viewFn: "&",
                view: '=',
                viewExpType: '<',

                cloneFn: '&',
                clone: '=',
                cloneExpType: '<',

                editFn: '&',
                edit: '=',
                editExpType: '<',

                deleteFn: '&',
                delete: '=',
                deleteExpType: '<',
            },
            templateUrl: '/app/admin/components/action-buttons/action-buttons.html',
            controller: 'ActionButtonsController as vm'
        });

    /* @ngInject */
    function ActionButtonsController($scope, $state) {
        var vm = this;
        //data

        //methods
        vm.$onInit = initialize;
        vm.redirect = redirect;

        //////////////
        function initialize() {
        }

        function redirect(view) {
            $state.go(view.sref, view.params);
        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }
})();