/**  * Created by BHARGAV on 27/6/18.
 */

(function () {
    "use strict";
    angular
        .module("AdminSetup.Masters") // to-do add module name and controller;
        .controller("upsertMasterController", upsertMasterController);

    /* @ngInject */
    function upsertMasterController($scope, $uibModalInstance, $timeout, MasterData,
                                    Notification, MasterService, CommonService) {
        let vm = this;

        vm.main_master      = !!MasterData ? MasterData.data : {"isActive": true};
        vm.nameFocus        = true;
        vm.isContinue       = false;
        vm.saveMasterLoader = false;

        vm.changeNameFn   = changeNameFn;
        vm.changeActiveFn = changeActiveFn;

        vm.cancelMasterFormFn = cancelMasterFormFn;
        vm.resetMasterFormFn  = resetMasterFormFn;
        vm.saveMasterDataFn   = saveMasterDataFn;
        vm.updateMasterDataFn = updateMasterDataFn;

        (function () {
            if (vm.main_master.id) {
                vm.main_master = _.pick(vm.main_master,
                    ["id", "name", "code", "description", "group", "image"]);
            }
        })();

        /**
         * Code to uppercase with '_'
         * @param {String} name
         */
        function changeNameFn(name) {
            vm.main_master.code = name ? CommonService.codeConver(name) : "";
        }

        /**
         * Change status of document
         * @param {Boolean} isActive
         */
        function changeActiveFn(isActive) {
            if (!isActive) {
                vm.main_master.isDefault = false;
            }
        }

        function cancelMasterFormFn() {
            $uibModalInstance.dismiss("cancel");
        }

        function resetMasterFormFn() {
            vm.main_master = {"code": null, "isActive": true};
            $timeout(function () {
                vm.nameFocus = true;
            });
        }

        function saveMasterDataFn(isContinue) {
            vm.isContinue = isContinue;

            let reqObj          = angular.copy(vm.main_master);
            vm.saveMasterLoader = true;

            MasterService
                .create(reqObj)
                .then(function (res) {
                    res = res.data;
                    if (res.code === "OK" && res.data) {
                        if (isContinue) {
                            $scope.$parent.vm.saveMasterDataFn(res.data); // Call parent function
                            vm.nameFocus   = true;
                            vm.main_master = {isActive: true};

                        }
                        else {
                            $uibModalInstance.close(res.data);
                        }
                        vm.imageSaved = true;
                        Notification.success(res.message);
                    }
                    else {
                        Notification.error(res.message);
                    }
                    vm.saveMasterLoader = false;

                }, function (err) {
                    vm.saveMasterLoader = false;
                    cancelMasterFormFn();
                    var error = err.data || {},
                        msg   = (
                            error.code ?
                                error.code + ":<br/>" + error.message :
                                err.status + ":<br/>" + err.statusText
                        );
                    Notification.error(msg);
                });
        }

        function updateMasterDataFn() {
            let reqObj = angular.copy(vm.main_master),
                id     = reqObj.id;

            delete reqObj.id;
            vm.saveMasterLoader = true;

            MasterService
                .update(id, reqObj)
                .then(function (res) {
                    res = res.data;

                    if (res.code === "OK" && res.data) {
                        let idx = _.findIndex($scope.$parent.vm.masters, {"id": res.data.id});

                        if (idx !== -1) {
                            $scope.$parent.vm.masters[idx] = res.data;

                            Notification.success(res.message);
                        }
                        else {
                            Notification.error("Something went wrong, please contact admin.");
                        }
                        vm.imageSaved = true;
                    }
                    else {
                        Notification.error(res.message);
                    }
                    vm.saveMasterLoader = false;
                    cancelMasterFormFn();

                }, function (err) {
                    vm.saveMasterLoader = false;
                    cancelMasterFormFn();
                    var error = err.data || {},
                        msg   = (
                            error.code ?
                                error.code + ":<br/>" + error.message :
                                err.status + ":<br/>" + err.statusText
                        );
                    Notification.error(msg);
                });
        }

        // Clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });
    }

})();