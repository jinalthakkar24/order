(function () {
    "use strict";
    angular
        .module("AdminSetup.Masters")
        .controller("MastersController", MastersController);

    /* @ngInject */
    function MastersController($scope, $state, $timeout, $uibModal, Modules, Notification,
                               MasterService, CommonService) {
        var vm = this;

        vm.moduleData = Modules[$state.current.name];

        // Master Data
        vm.masters = [];
        vm.masterData = {};

        // Header
        vm.refreshLoader = false;

        vm.search = "";
        vm.searchFocus = true;
        vm.searchApplied = false;
        vm.searchLoader = false;

        vm.sortBy = {};

        vm.dragControlListeners = {};
        vm.sortedSeq = [];
        vm.updatingSequence = false;

        // Master upsert modal
        var modalInstance = null;
        vm.saveMasterLoader = false;

        // Header
        vm.refreshFn = refreshFn;
        vm.searchFn = searchFn;

        // Table Header
        vm.upsertMasterModalFn = upsertMasterModalFn;
        vm.sortByFn = sortByFn;

        /* Get Master List Function */
        vm.getMastersFn = getMastersFn;
        vm.activeDeactiveMasterFn = activeDeactiveMasterFn;
        vm.updateSequenceFn = updateSequenceFn;

        vm.cancelMasterForm = cancelMasterForm;
        vm.saveMasterDataFn = saveMasterDataFn;

        vm.setViewMasterData = setViewMasterData;
        vm.showInfoFn = showInfoFn;

        vm.showDeleteModalFn = showDeleteModalFn;
        vm.deleteMasterFn = deleteMasterFn;

        ////////////////
        (function () {
            angular.element("#master-detail-modal, .singleDeleteDependencyModal").on("hidden.bs.modal", function () {
                vm.searchFocus = true;
            });

            getMastersFn();
        })();

        function getMastersFn() {
            var obj = {};
            vm.sortedSeq = [];
            vm.masters = [];
            vm.show_loading = true;
            obj.sort = "sortingSequence ASC";
            obj.filter = {
               isDeleted : false
            };

            if (vm.search) {
                obj.search = {
                    "keys": ["normalizeName", "name", "code", "group"],
                    "keyword": vm.search
                };
            }
            else {
                delete  obj.search;
            }
            obj.isOnlyParents = true;


            MasterService
                .list(obj)
                .then(
                    function (res) {
                        res = res.data;

                        if (res.code === "OK") {
                            vm.masters = res.data;
                            vm.idsMasters = _.pluck(vm.masters, "id");

                            vm.dragControlListeners = CommonService.getDragControlListnersObjectFn(
                                vm.masters, function (SortedSeq) {
                                    vm.sortedSeq = SortedSeq;
                                    vm.searchFocus = false;
                                }
                            );
                        } else {
                            $scope.setFlash('e', res.message);
                        }

                        vm.show_loading = false;
                        vm.refreshLoader = false;
                        vm.searchLoader = false;

                        $timeout(function () {
                            if (vm.searchApplied) {
                                vm.searchFocus = true;
                            }
                        });
                        vm.searchFocus = true;

                    }, function (err) {
                        vm.searchFocus = true;
                        vm.show_loading = false;
                        vm.refreshLoader = false;
                        vm.searchLoader = false;
                        $scope.flashHttpErrorFn(err);
                    }
                );
        }

        // Refresh Function
        function refreshFn() {
            vm.search = "";
            vm.searchFocus = false;
            vm.refreshLoader = true;
            vm.sortBy = {};
            vm.getMastersFn();
        }

        /* Search Fn */
        function searchFn() {
            vm.searchApplied = false;
            vm.searchFocus = false;

            if (vm.search) {
                vm.searchLoader = true;
                vm.searchApplied = true;
                vm.getMastersFn();
            }
            else {
                vm.getMastersFn(vm.sortByVal);
            }
        }

        function upsertMasterModalFn(masterId = null) {
            vm.searchFocus = false;

            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "/app/admin/admin-setup/masters/mainMasters/modals/upsertMainMaster.html",
                size: "lg",
                backdrop: "static",
                controller: "upsertMasterController",
                controllerAs: "vm",
                scope: $scope,
                resolve: {
                    MasterData: function () {
                        if (masterId) {
                            return MasterService.viewMaster(masterId).then(function (res) {
                                return res.data;
                            });
                        }
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (masterData) {
                vm.searchFocus = true;
                saveMasterDataFn(masterData);
            }, function () {
                vm.searchFocus = true;
                // This is compulsory, otherwise you'll get
                // Possibly unhandled rejection: cancel undefined
            });
        }

        function cancelMasterForm() {
            modalInstance.dismiss("cancel");
        }

        function saveMasterDataFn(masterData) {
            if (masterData) {
                vm.masters.unshift(masterData);
            }
        }

        /**
         * Sort table data via angular filter
         * @param {String} key
         * @param {String} val
         */
        function sortByFn(key, type, all = false) {
            vm.masters = _.sortBy(vm.masters, function (i) {
                return i[key].toLowerCase();
            });

            if (all) {
                type = (type && type == 1) ? -1 : 1;
            }

            vm.sortBy = {};
            vm.sortBy[key] = type;
            vm.sortBy.type = type;

            if (type == -1) {
                vm.masters.reverse();
            }
        }

        /**
         * change active/deactive
         * @param data => Object
         * @param key => Updated val key
         */
        function activeDeactiveMasterFn(data, key) {
            var obj = {};

            if (key == "isDefault") {
                obj["isDefault"] = !data['isDefault'];
                obj["isActive"] = data['isActive'];
            }
            else if (key == "isActive") {
                obj["isActive"] = !data['isActive'];
                obj["isDefault"] = data['isDefault'];
            }

            MasterService
                .update(data.id, obj)
                .then(function (res) {
                    res = res.data;
                    if (res.code === "OK") {
                        _.each(vm.masters, function (m, index) {
                            if (m.id == data.id) {
                                if (res.data.isDefault) {
                                    var default_mst = _.findWhere(vm.masters, {isDefault: true});
                                    if (default_mst) {
                                        var ind = _.indexOf(_.pluck(vm.masters, "id"), default_mst.id);
                                        if (ind >= 0) {
                                            vm.masters[ind].isDefault = false;
                                        }
                                    }
                                }
                                vm.masters[index].isDefault = res.data.isDefault;
                                vm.masters[index].isActive = res.data.isActive;
                            }
                        });
                        $scope.setFlash("s", res.message);
                    } else {
                        $scope.setFlash("e", res.message);
                    }
                }, function (err) {
                    if (err.data && err.data.message) {
                        $scope.flashHttpErrorFn(err);
                    }
                });


        }

        /* Update Sequence Function */
        function updateSequenceFn() {
            var obj = {};
            obj.sequences = [];

            if (vm.sortedSeq.length) {
                obj.sequences = vm.sortedSeq;
            }

            vm.updatingSequence = true;

            MasterService
                .setSequences(obj)
                .then(function (res) {
                    res = res.data;
                    if (res.code === "OK") {
                        vm.sortedSeq = [];
                        $scope.setFlash("s", res.message);
                    }
                    else {
                        $scope.setFlash("e", res.message);
                    }
                    vm.updatingSequence = false;
                    vm.searchFocus = true;

                }, function (err) {
                    vm.updatingSequence = false;
                    vm.searchFocus = true;
                    $scope.flashHttpErrorFn(err);
                });
        }

        function setViewMasterData(index) {
            vm.masterData = angular.copy(vm.masters[index]);
            vm.masterData.index = index;
        }

        // Show master data in modal
        function showInfoFn(index) {
            setViewMasterData(index);
            vm.searchFocus = false;
            angular.element("#master-detail-modal").modal("show");
        }

        /**
         * Show Delete confirm modal
         * @param {String} id
         * @param {String} name
         */
        function showDeleteModalFn(id, name) {
            vm.documentId = angular.copy(id);
            vm.deleteDesc = name;
            vm.searchFocus = false;
            vm.showModal = true;
        }

        /**
         * Open modal to show dependencies
         * @param {Boolean}
         */
        function deleteMasterFn(clearDependencies) {
            let obj = {
                masters: [vm.documentId]
            };
            if (clearDependencies) {
                obj.clearDependencies = clearDependencies;
            }
            MasterService
                .deleteMaster(obj)
                .then(function (res) {
                        var res = res.data;
                        if (res.code && res.code === "OK") {
                            $(".singleDeleteDependencyModal").modal("hide");
                            var deleteIndex = _.findIndex(vm.masters, {id: vm.documentId});
                            if (deleteIndex >= 0) {
                                vm.masters[deleteIndex].showModal = false;
                                vm.masters.splice(deleteIndex, 1);
                            }
                            vm.idsMasters = _.pluck(vm.masters, "id");
                            Notification.success({"message": res.message});
                        }
                        else {
                            if (res.data && res.data.dependent && res.data.dependent.length) {
                                vm.dependencyData = angular.copy(res.data.dependent[0]);
                                vm.dependencyData.modal = "Master";
                                $(".singleDeleteDependencyModal").modal("show");
                                $(".singleDeleteDependencyModal").on("shown.bs.modal", function () {
                                    $timeout(function () {
                                        var hdrHeight = $("#tHeader").outerHeight();
                                        var ftrHeight = $("#tFooter").outerHeight();
                                        var height = hdrHeight + ftrHeight + 27;
                                        var finalHeight = window.innerHeight - height;

                                        $("#tBody").css("max-height", finalHeight);
                                        $("#tBody").css("height", finalHeight);
                                        $("#tBody").css("overflow", "auto");
                                    }, 100);
                                });
                            }
                            Notification.error({"message": res.message});
                        }
                        vm.showModal = false;
                        vm.searchFocus = true;
                    },
                    function (resError) {
                        var error = resError.data,
                            msg = (
                                error.code ?
                                    error.code + ":<br/>" + error.message :
                                    resError.status + ":<br/>" + resError.statusText
                            );
                        Notification.error({"message": msg});
                        vm.showModal = false;
                        vm.searchFocus = true;
                    }
                );
        }

        //////////////////////////////////////////////////End : Pre - Next Button ///////////////////////////////////////////////
        // Clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });

    }

})();
