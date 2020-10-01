(function () {
    'use strict';

    angular
        .module('Users')
        .controller('UsersViewModalController', UsersViewModalController);


    /* @ngInject */
    function UsersViewModalController($scope, User, $uibModalInstance) {
        var vm = this;
        //data
        vm.user = User;
        //methods
        vm.closeModal = closeModal;
        ///////


        (function () {
        })();

        function closeModal() {
            $uibModalInstance.dismiss('cancel');
        }
        //clear vm
        $scope.$on('$destroy', function () {
            vm = []
        });
    }
})();