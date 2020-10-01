/**  * Created by BHARGAV on 27/6/18.
 */

(function () {
    "use strict";
    angular
        .module("AdminSetup.Masters") // to-do add module name and controller;
        .controller("upsertSubMasterController", upsertSubMasterController);

    /* @ngInject */
    function upsertSubMasterController($scope, $uibModalInstance, $timeout, SubMasterData, REGEX_COLLECTION,
                                       Notification, MasterService, CommonService) {
        let vm = this;

        vm.child_master = !!SubMasterData ? SubMasterData.data : {"isActive": true};

        vm.codePattern         = REGEX_COLLECTION.CODE_VAR;
        vm.nameFocus           = true;
        vm.isContinue          = false;
        vm.saveSubMasterLoader = false;

        vm.changeNameFn   = changeNameFn;
        vm.changeActiveFn = changeActiveFn;

        vm.cancelSubMasterFormFn = cancelSubMasterFormFn;
        vm.resetSubMasterFormFn  = resetSubMasterFormFn;
        vm.saveSubMasterDataFn   = saveSubMasterDataFn;
        vm.updateSubMasterDataFn = updateSubMasterDataFn;

        (function () {
            if (vm.child_master.id) {
                vm.child_master = _.pick(vm.child_master,
                    ["id", "parentId", "name", "code", "description", "group", "image", "icon"]);
            }
        })();

        /**
         * Code to uppercase with '_'
         * @param {String} name
         */
        function changeNameFn(name) {
            if (name) {
                vm.child_master.code = CommonService.codeConver(name);
            }
            else {
                vm.child_master.code = "";
            }
        }

        /**
         * Change status of document
         * @param {Boolean} isActive
         */
        function changeActiveFn(isActive) {
            if (!isActive) {
                vm.child_master.isDefault = false;
            }
        }

        function cancelSubMasterFormFn() {
            $uibModalInstance.dismiss("cancel");
        }

        function resetSubMasterFormFn() {
            vm.child_master = {"code": null, "isActive": true};
            $timeout(function () {
                vm.nameFocus = true;
            });
        }

        function saveSubMasterDataFn(isContinue) {
            vm.isContinue = isContinue;

            let reqObj      = angular.copy(vm.child_master);
            reqObj.parentId = $scope.$parent.vm.current_parent_master;

            vm.saveSubMasterLoader = true;

            MasterService
                .create(reqObj)
                .then(function (res) {
                    res = res.data;
                    if (res.code === "OK" && res.data) {
                        if (isContinue) {
                            $scope.$parent.vm.saveSubMasterDataFn(res.data); // Call parent function
                            vm.nameFocus    = true;
                            vm.child_master = {isActive: true};
                        }
                        else {
                            $uibModalInstance.close(res.data);
                        }

                        Notification.success(res.message);
                    }
                    else {
                        Notification.error(res.message);
                    }
                    vm.saveSubMasterLoader = false;

                }, function (err) {
                    vm.saveSubMasterLoader = false;
                    vm.cancelSubMasterFormFn();
                    var error = err.data || {},
                        msg   = (
                            error.code ?
                                error.code + ":<br/>" + error.message :
                                err.status + ":<br/>" + err.statusText
                        );
                    Notification.error(msg);
                });
        }

        function updateSubMasterDataFn() {
            let reqObj      = angular.copy(vm.child_master),
                subMasterId = reqObj.id;

            delete reqObj.id;
            vm.saveSubMasterLoader = true;

            MasterService
                .update(subMasterId, reqObj)
                .then(function (res) {
                    res = res.data;

                    if (res.code === "OK" && res.data) {
                        let masterIndex = _.findIndex($scope.$parent.vm.masters, {"id": res.data.parentId});

                        if (masterIndex !== -1) {
                            let subMasterIndex = _.findIndex($scope.$parent.vm.child_masters, {"id": subMasterId});
                            if (subMasterIndex !== -1) {
                                $scope.$parent.vm.child_masters[subMasterIndex] = res.data;
                                Notification.success(res.message);
                            }
                            else {
                                Notification.error("Something went wrong, please contact admin.");
                            }
                        }
                        else {
                            Notification.error("Something went wrong, please contact admin.");
                        }
                    }
                    else {
                        Notification.error(res.message);
                    }
                    vm.saveSubMasterLoader = false;
                    vm.cancelSubMasterFormFn();

                }, function (err) {
                    vm.saveSubMasterLoader = false;
                    vm.cancelSubMasterFormFn();
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
