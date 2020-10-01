(function () {
    'use strict';

    angular.module('Users')
        .controller('UsersViewModalController', UsersViewModalController);

    /* @ngInject */
    function UsersViewModalController($scope, $state, $uibModalInstance, CommonCrudService, userID,CommonService) {
        var vm       = this, model = "user";
        vm.userId    = userID;
        vm.item      = {};
        vm.activeTab = 0;
        vm.stepIndex = 0;

        vm.closeModal = closeModal;
        vm.openCommonPopoverFn = openCommonPopoverFn;
        $scope.closeCommonPopoverFn = closeCommonPopoverFn;
        $scope.displayImages = CommonService.displayImages;

        /////////
        (function () {

            if (vm.userId) {

                CommonCrudService
                    .view(model, vm.userId)
                    .then(
                        (res) => {
                            if (res.code === 'OK') {
                                vm.item = res.data;
                            }
                            else {
                                $state.go("apps.adminSetup.user.list");
                                $scope.setFlash('e', res.message);
                            }
                        },
                        (err) => {
                            $scope.flashHttpErrorFn(err);
                        }
                    );
            }
        })();

        function closeModal() {
            $uibModalInstance.dismiss("cancel");
        }

        // Common Popover function
        function openCommonPopoverFn(name, openKey, data, key) {
            $scope.detailPopover = {"templateUrl": name};
            if (data) {
                $scope.popoverData = data;
                $scope.contactskey = key;
            }
            $scope.isOpenKey = openKey;
            $scope.detailPopover[openKey] = true;
        }

        function closeCommonPopoverFn() {
            $scope.detailPopover[$scope.isOpenKey] = false;
        }

    }
})();