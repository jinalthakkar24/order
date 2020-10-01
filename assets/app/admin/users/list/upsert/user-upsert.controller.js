(function () {
    "use strict";

    angular
        .module("Users")
        .controller("UserUpsertController", UserUpsertController);

    /* @ngInject */
    function UserUpsertController($scope, $state, Modules, LocalStorageService, CommonCrudService,
                                  Notification, UserService, UserTypes, CommonService) {
        var vm        = this;
        //data
        vm.moduleData = Modules[$state.current.name];

        vm.address = {};

        vm.userId           = $state.params.userId;
        vm.userType         = UserTypes.ADMIN;
        vm.userTypeConstant = UserTypes;
        vm.stateParamObj    = $state.params;
        vm.userAddress      = [];
        vm.userTypes        = [
            {
                name: "Admin",
                id  : UserTypes.ADMIN
            },
            {
                name: "Customer",
                id  : UserTypes.CUSTOMER
            },
            {
                name: "Cleaner",
                id  : UserTypes.CLEANER
            }
        ];
        vm.user             = {};
        vm.user.type        = vm.userTypes[0].id;

        //methods
        vm.addItemFn    = addItemFn;
        vm.resetFormFn  = resetFormFn;
        vm.getSubAdmins = getSubAdmins;
        vm.getRolesList = getRolesList;

        vm.resetAddressFn  = resetAddressFn;
        vm.saveAddress     = saveAddress;
        vm.showDelModalFn  = showDelModalFn;
        vm.removeAddressFn = removeAddressFn;

        vm.editSingleAddress   = editSingleAddress;
        vm.setAddressAsPrimary = setAddressAsPrimary;
        vm.addNext             = addNext;
        vm.closeNext           = closeNext;
        ///////////////

        (function () {
            if ($state.params.userId) {
                UserService
                    .view($state.params.userId)
                    .then(function (res) {
                        res = res.data;
                        if (res.code === "OK") {
                            vm.user         = res.data;
                            vm.uploadedFile = vm.user.image;

                            if (vm.user.emails && vm.user.emails.length) {
                                vm.emails = vm.user.emails;
                                delete vm.user.emails;
                            }

                            if (vm.user.mobiles && vm.user.mobiles.length) {
                                vm.mobiles = vm.user.mobiles;
                                delete vm.user.mobiles;
                            }

                            if (vm.user.addresses && vm.user.addresses.length) {
                                vm.userAddress = vm.user.addresses;
                            }
                            else {
                                vm.userAddress = [];
                            }
                            setTimeout(function () {
                                $("#mobile").trigger("input");
                            }, 500);
                            delete vm.user.password;
                        }
                    });
            }
            else {
                vm.user = {
                    type  : parseInt(vm.userType),
                    emails: [{
                        isPrimary: true,
                        email    : ""
                    }]
                };
                console.log(vm.user);

                vm.mobiles = [];
                vm.emails  = [];

                if (vm.userType == UserTypes.SUB_ADMIN) {
                    getSubAdmins();
                }
            }
            getRolesList();

        })();

        function getRolesList() {
            vm.roleList = [];
            let obj     = {};

            CommonCrudService
                .paginate("roles", obj)
                .then(function (res) {
                    if (res.code === "OK") {
                        if (res.data && res.data.list && res.data.list.length) {
                            vm.roleList = res.data.list;
                        }
                        else {
                            vm.roleList = [];
                        }
                    }
                    else {
                        vm.roleList = [];
                    }
                }, function (err) {
                    vm.roleList = [];
                });
        }

        /**
         * Add
         */
        function addItemFn() {
            var obj = angular.copy(vm.user);

            if (vm.userAddress && vm.userAddress.length) {
                obj.addresses = angular.copy(vm.userAddress);
            }

            if (vm.emails && vm.emails.length) {
                obj.emails = [];
                obj.emails = CommonService.commonEmailPhoneReqService(vm.emails, "email", vm.is_primary_email);
            }

            if (vm.mobilesRequest && vm.mobilesRequest.length) {
                obj.mobiles = [];
                obj.mobiles = CommonService.commonEmailPhoneReqService(vm.mobilesRequest, "mobile", vm.is_primary_mobile);
            }


            if ($state.params.userId || vm.user.id) {
                obj.id = $state.params.userId || vm.user.id;
                CommonCrudService
                    .update("user", obj.id, obj)
                    .then(function (res) {
                        if (res.code === "OK") {
                            $scope.setFlash('s', res.message);
                            $('#password-strength-label').text('');
                            $("#password-strength-label").removeClass("p15 btn-rounded");
                            $('.strength-meter-fill').removeAttr('data-strength');
                            $state.go("apps.users.list");
                        }
                        else {
                            $scope.setFlash('e', res.message);
                        }
                    }, function (err) {
                        if (err.data && err.data.message) {
                            Notification.error({"message": err.data.message});
                        }
                    });
            }
            else {
                UserService
                    .create(obj)
                    .then(function (res) {
                        res = res.data;
                        if (res.code === "OK") {
                            Notification.success({"message": res.message});
                            if (vm.isContinue) {
                                vm.resetFormFn();
                            }
                            else {
                                $state.go("apps.users.list");
                            }
                            vm.userAddress = [];
                            $('#password-strength-label').text('');
                            $("#password-strength-label").removeClass("p15 btn-rounded");
                            $('.strength-meter-fill').removeAttr('data-strength');
                        }
                        else {
                            $scope.setFlash("e", res.message);
                        }
                    }, function (err) {
                        if (err.data && err.data.message) {
                            Notification.error({"message": err.data.message});
                        }
                    });
            }

        }

        function getSubAdmins() {
            var obj = {
                filter: {
                    type: UserTypes.SUB_ADMIN
                }
            };
            CommonCrudService
                .paginate("user", obj)
                .then(function (res) {
                    if (res.code === "OK") {
                        vm.subAdmins = res.data.list;
                    }
                    else {
                        $scope.setFlash("e", res.message);
                    }
                }, function () {

                });
        }

        /**
         * Reset Form
         */
        function resetFormFn(delImage = false) {
            if (vm.user.image && delImage) {
                vm.removeImage = true;
            }

            vm.user            = {};
            vm.user.type       = parseInt(vm.userType);
            vm.confirmPassword = "";

            vm.mobiles     = [];
            vm.emails      = [];
            vm.userAddress = [];
            $('#password-strength-label').text('');
            $("#password-strength-label").removeClass("p15 btn-rounded");
            $('.strength-meter-fill').removeAttr('data-strength');
        }

        /**
         * Check Value Function
         * @param newcase
         * @param array
         */
        vm.checkValueFn = function (newcase, array) {
            switch (newcase) {
                case "mobile":
                    if (array && array.length) {
                        if (array[0] && array[0].mobile) {
                            vm.is_mobile = true;
                        }
                        else {
                            vm.is_mobile = false;
                        }
                    }
                    break;
                case "email":
                    if (array && array.length) {
                        if (array[0] && array[0].email) {
                            vm.is_email = true;
                        }
                        else {
                            vm.is_email = false;
                        }
                    }
                    break;
            }
        };

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

        function addNext(type, index) {
            vm.user[type].push({
                isPrimary  : false,
                mobile     : "",
                countryCode: "+91"
            });
        }

        function closeNext() {

        }

        //clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });
    }

})();
