(function () {
    "use strict";
    angular.module("AdminSetup.Masters")
        .controller("SubMastersController", SubMastersController);

    /* @ngInject */
    function SubMastersController($scope, $state, $uibModal, $timeout, $location, Modules,
                                  MasterService, CommonService) {
        var vm = this;

        vm.moduleData = Modules[$state.current.name];

        // Master Data
        vm.master = {isActive: true};
        vm.masters = [];
        vm.masterLoading = false;

        // Sub Master Data
        vm.child_master = {};
        vm.child_masters = [];

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

        // Sub Master upsert modal
        var modalInstance = null;
        vm.saveSubMasterLoader = false;

        vm.master_detail = {};
        vm.activeMaster = {};
        vm.active_masters = [];

        vm.current_parent_master = "";

        // Header
        vm.refreshFn = refreshFn;
        vm.searchFn = searchFn;
        vm.updateSequenceFn = updateSequenceFn;
        vm.upsertSubMasterModalFn = upsertSubMasterModalFn;

        // Table Header
        vm.sortByFn = sortByFn;

        /////////////
        vm.getMastersFn = getMastersFn;
        vm.MasterChngFn = MasterChngFn;
        vm.tabChangeFn = tabChangeFn;
        vm.activeDeactiveMasterFn = activeDeactiveMasterFn;

        vm.saveSubMasterDataFn = saveSubMasterDataFn;

        // Show sub master detail view
        vm.setViewSubMasterData = setViewSubMasterData;
        vm.showSubMasterDetailFn = showSubMasterDetailFn;

        (function () {
            angular.element("#sub-master-detail-modal, .singleDeleteDependencyModal").on("hidden.bs.modal", function () {
                vm.searchFocus = true;
            });

            vm.getMastersFn();
        })();

        /* Get Master List Function */
        function getMastersFn() {
            var obj = {
                "sort": "sortingSequence ASC",
                "isOnlyParents": true
            };

            vm.masters = [];
            vm.active_masters = [];
            vm.child_masters = [];
            vm.sortedSeq = [];

            vm.masterLoading = true;
            obj.filter = {
                isDeleted : false
            };

            MasterService
                .list(obj)
                .then(
                    function (res) {
                        res = res.data;

                        if (res.code === "OK" && res.data && res.data.length) {
                            vm.masters = res.data;

                            vm.active_masters = [];
                            vm.active_masters = _.where(vm.masters, {isActive: true});

                            if ($state && $state.params && $state.params.masterId) {
                                var master = _.findWhere(vm.masters, {id: $state.params.masterId});
                                if (master && !vm.refreshLoader) {
                                    vm.activeMaster = master;
                                }
                            }
                            else {
                                if (!vm.refreshLoader) {
                                    if (vm.active_masters.length) {
                                        vm.master_detail = vm.active_masters[0];
                                    }
                                    else {
                                        vm.master_detail = vm.masters[0];
                                    }
                                    vm.activeMaster = vm.master_detail;
                                }
                            }

                            vm.MasterChngFn(vm.activeMaster);
                        }
                        else {
                            vm.refreshLoader = false;
                            vm.searchLoader = false;
                        }
                        vm.masterLoading = false;

                    }, function (err) {
                        vm.masterLoading = false;
                        vm.refreshLoader = false;
                        vm.searchLoader = false;
                        $scope.flashHttpErrorFn(err);
                    }
                );
        }

        // Master Change Function
        function MasterChngFn(master, sort_by) {
            vm.show_loading = true;
            vm.toggleAdd = false;

            vm.child_masters = [];
            vm.sortedSeq = [];

            vm.master = {isActive: true};


            var obj = {};
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

            if (sort_by) {
                obj.sort = sort_by;
            }

            vm.current_parent_master = master.id;
            obj.parentId = master.id;

            vm.child_masters = [];

            MasterService
                .list(obj)
                .then(
                    function (res) {
                        res = res.data;

                        if (res.code === "OK") {
                            vm.child_masters = res.data;

                            vm.dragControlListeners = CommonService.getDragControlListnersObjectFn(
                                vm.child_masters, function (SortedSeq) {
                                    vm.sortedSeq = SortedSeq;
                                    vm.searchFocus = false;
                                }
                            );
                        }

                        vm.show_loading = false;
                        vm.refreshLoader = false;
                        vm.searchLoader = false;
                        vm.searchFocus = true;

                    }, function (err) {
                        vm.show_loading = false;
                        vm.refreshLoader = false;
                        vm.searchLoader = false;
                        vm.searchFocus = true;

                        $scope.flashHttpErrorFn(err);
                    }
                );
        }

        // Refresh Function
        function refreshFn() {
            vm.searchMasters = "";
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
            }

            vm.MasterChngFn(vm.activeMaster);
        }

        function upsertSubMasterModalFn(subMasterId = null) {
            vm.searchFocus = false;
            modalInstance = $uibModal.open({
                animation: true,
                ariaLabelledBy: "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl: "/app/admin/admin-setup/masters/subMasters/modals/upsertSubMaster.html",
                size: "lg",
                backdrop: "static",
                controller: "upsertSubMasterController",
                controllerAs: "vm",
                scope: $scope,
                resolve: {
                    SubMasterData: function () {
                        if (subMasterId) {
                            return MasterService.viewMaster(subMasterId).then(function (res) {
                                return res.data;
                            });
                        }
                        return null;
                    }
                }
            });

            modalInstance.result.then(function (subMasterData) {
                vm.searchFocus = true;
                saveSubMasterDataFn(subMasterData);
            }, function () {
                vm.searchFocus = true;
                // This is compulsory, otherwise you'll get
                // Possibly unhandled rejection: cancel undefined
            });
        }

        function saveSubMasterDataFn(subMasterData) {
            if (subMasterData) {
                vm.child_masters.unshift(subMasterData);
            }
        }

        /* Tab Change Fn */
        function tabChangeFn(master) {
            vm.searchFocus = false;
            if ($state && $state.params && $state.params.id) {
                $location.search("id", null);
            }
            if (master) {
                vm.activeMaster = master;
                vm.MasterChngFn(master);
            }
        }

        /* Active Deactive Function */
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
                        _.each(vm.child_masters, function (m, index) {
                            if (m.id == data.id) {
                                if (res.data.isDefault) {
                                    var default_mst = _.findWhere(vm.child_masters, {isDefault: true});
                                    if (default_mst) {
                                        var ind = _.indexOf(_.pluck(vm.child_masters, "id"), default_mst.id);
                                        if (ind >= 0)
                                            vm.child_masters[ind].isDefault = false;
                                    }
                                }
                                vm.child_masters[index].isDefault = res.data.isDefault;
                                vm.child_masters[index].isActive = res.data.isActive;
                            }
                        });
                        $scope.setFlash("s", res.message);
                    }
                    else {
                        $scope.setFlash("e", res.message);
                    }

                }, function (err) {
                    $scope.flashHttpErrorFn(err);
                });
        }

        /* Update Master Sequence Function */
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

        /**
         * Sort table data via angular filter
         * @param key
         * @param val
         */
        function sortByFn(key, type, all = false) {
            vm.child_masters = _.sortBy(vm.child_masters, function (i) {
                return i[key].toLowerCase();
            });

            if (all) {
                type = (type && type == 1) ? -1 : 1;
            }

            vm.sortBy = {};
            vm.sortBy[key] = type;
            vm.sortBy.type = type;

            if (type == -1) {
                vm.child_masters.reverse();
            }
        }

        function setViewSubMasterData(index) {
            vm.masterData = angular.copy(vm.child_masters[index]);
            vm.masterData.index = index;
        }

        // Show master data in modal
        function showSubMasterDetailFn(index) {
            vm.searchFocus = false;
            setViewSubMasterData(index);
            angular.element("#sub-master-detail-modal").modal("show");
        }

        // Show delete modal
        vm.showDeleteModalFn = (id) => {
            vm.documentId = angular.copy(id);
            vm.deleteDesc = name;
            vm.showModal = true;
        };

        /**
         * Open modal to shoe dependencies
         * @type {openModal}
         */
        /**
         * Open modal to show dependencies
         */
        vm.deleteMasterFn = function (clearDependencies) {
            let obj = {
                masters: [vm.documentId]
            };
            if (clearDependencies) {
                obj.clearDependencies = clearDependencies;
            }
            MasterService
                .deleteMaster(obj)
                .then(
                    function (res) {
                        var res = res.data;
                        if (res.code && res.code === "OK") {
                            $(".singleDeleteDependencyModal").modal("hide");
                            var deleteIndex = _.findIndex(vm.child_masters, {id: vm.documentId});
                            if (deleteIndex >= 0) {
                                vm.child_masters[deleteIndex].showModal = false;
                                vm.child_masters.splice(deleteIndex, 1);
                            }
                            vm.idsMasters = _.pluck(vm.masters, "id");
                            $scope.setFlash("s", res.message);
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
                            $scope.setFlash("e", res.message);
                        }
                        vm.showModal = false;
                    },
                    function (resError) {
                        vm.showModal = false;
                        $scope.flashHttpErrorFn(resError);
                    }
                );
        };

        // Clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });

    }

})();
