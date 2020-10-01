(function () {
    'use strict';
    angular
        .module('Users')
        .controller('UserProfileController', UserProfileController);

    /* @ngInject */
    function UserProfileController($scope, Modules, Notification, AuthService, $state, CommonCrudService, UserService, $localStorage, CommonService) {
        var vm        = this;
        vm.tab        = {
            "basic"   : 1,
            "password": 2
        };
        vm.currentTab = vm.tab.basic;
        //data
        //data
        vm.moduleData       = Modules[$state.current.name];
        //methods
        vm.changePasswordFn = changePasswordFn;
        vm.updateUserFn     = updateUserFn;

        vm.resetAddressFn      = resetAddressFn;
        vm.saveAddress         = saveAddress;
        vm.showDelModalFn      = showDelModalFn;
        vm.removeAddressFn     = removeAddressFn;
        vm.editSingleAddress   = editSingleAddress;
        vm.setAddressAsPrimary = setAddressAsPrimary;

        /////////////////

        (function () {
            vm.user         = AuthService.getUser();
            vm.uploadedFile = vm.user.image;
            vm.userAddress      = vm.user && vm.user.addresses ? vm.user.addresses : [];
            vm.emails       = angular.copy(vm.user.emails);
            vm.mobiles      = angular.copy(vm.user.mobiles);
        })();

        function changePasswordFn(newPassword) {
            var obj = {
                id         : vm.user.id,
                newPassword: newPassword
            };

            UserService
                .resetPassword(obj)
                .then(function (res) {
                        var res = res.data;
                        if (res.data && res.code === "OK") {
                            vm.newPassword      = '';
                            vm.confirm_password = '';
                            $('#password-strength-label').text('');
                            $('.strength-meter-fill').removeAttr('data-strength');
                            Notification.success({message: res.message});
                        }
                    },
                    function (err) {
                        if (err.data && err.data.message) {
                            Notification.error({message: err.data.message})
                        }
                    })
        }

        function resetAddressFn() {
            vm.address          = {};
            vm.addressEditIndex = "";
            vm.delIndex         = -1;
        }

        function saveAddress() {
            if (!(vm.address.country && vm.address.pincode)) {
                $scope.setFlash("e", "At-least country & postal code is required.");
                return;
            }

            if (vm.addressEditIndex >= 0 && vm.addressEditIndex !== "") {
                vm.userAddress[vm.addressEditIndex] = vm.address;
            }
            else {
                if (!vm.userAddress) {
                    vm.userAddress = [];
                }
                vm.userAddress.push(vm.address);
            }
            resetAddressFn();
        }

        function removeAddressFn() {
            vm.userAddress.splice(vm.delIndex, 1);
            vm.delIndex = -1;
            resetAddressFn();
        }

        function showDelModalFn(index) {
            if (vm.userId) {
                vm.showAddressDeleteModal = true;
                return;
            }
            vm.delIndex = index;
            removeAddressFn();
        }

        function editSingleAddress(index) {
            vm.address          = angular.copy(vm.userAddress[index]);
            vm.address.pincode  = parseInt(vm.address.pincode);
            vm.addressEditIndex = index;
        }

        // set shipping Address as primary

        function setAddressAsPrimary(index) {
            let findIndex = _.findIndex(vm.userAddress, {isPrimary: true});
            if (findIndex >= 0) {
                vm.userAddress[findIndex].isPrimary = false;
            }

            vm.userAddress[index].isPrimary = true;
        }

        function updateUserFn() {
            let obj = angular.copy(vm.user);
            if (vm.uploadedFile) {
                obj.image = vm.uploadedFile;
            }
            else {
                obj.image = null;
            }

            if (vm.emails && vm.emails.length) {
                obj.emails = [];
                obj.emails = CommonService.commonEmailPhoneReqService(vm.emails, 'email', vm.is_primary_email);
            }

            if (vm.mobilesRequest && vm.mobilesRequest.length) {
                obj.mobiles = [];
                obj.mobiles = CommonService.commonEmailPhoneReqService(vm.mobilesRequest, 'mobile', vm.is_primary_mobile);
            }

            if (vm.userAddress && vm.userAddress.length) {
                obj.addresses = angular.copy(vm.userAddress);
            }


            CommonCrudService
                .update('user', obj.id, obj)
                .then(function (res) {
                    if (res.code === 'OK') {
                        $scope.loginUser   = _.first(res.data);
                        $localStorage.user = JSON.stringify($scope.loginUser);
                        vm.user            = _.first(res.data);
                        Notification.success({'message': res.message});
                    }
                }, function (err) {
                    if (err.data && err.data.message) {
                        Notification.error({'message': err.data.message});
                    }
                });

        }


        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }

})();