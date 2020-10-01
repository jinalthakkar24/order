(function () {
    "use strict";
    angular
        .module("Users")
        .controller("CleanerController", CleanerController);

    function CleanerController($scope, $state, Modules, CleanerService, UserService, CleanerType, UserTypes, CommonCrudService, MasterService) {
        var vm = this;

        // Data
        vm.moduleData = Modules[$state.current.name];

        vm.searchFocus = true;

        // Pagination - PAGE & LIMIT
        vm.page                   = 1;
        vm.limit                  = _.first($scope.defaultLimitRange).limit;
        let findDefaultLimitIndex = _.findIndex($scope.defaultLimitRange, {limit: vm.limit});
        vm.limitsArray            = $scope.defaultLimitRange.slice(findDefaultLimitIndex);

        vm.list_showing_from = 0;
        vm.list_showing_to   = 0;
        vm.totalCount        = 0;

        vm.cleanerType = CleanerType;
        vm.usersType   = UserTypes;
        vm.cuType      = UserTypes.CLEANER;

        vm.tabs = [
            {
                type               : CleanerType.APPROVED,
                name               : "Approved",
                hasPermissionFilter: $scope.listPermission,
                hasModule          : $scope.moduleApproved
            },
            {
                type               : CleanerType.PENDING_APPROVAL,
                name               : "Pending Approval",
                hasPermissionFilter: $scope.listPermission,
                hasModule          : $scope.modulePendingApproved
            },
            {
                type               : CleanerType.REJECTED,
                name               : "Rejected",
                hasPermissionFilter: $scope.listPermission,
                hasModule          : $scope.moduleRejected
            }
        ];

        if ($state.current.name === "apps.users.pendingApprovedCleaners") {
            vm.activeTab = vm.tabs[1].type;
        }
        else if ($state.current.name === "apps.users.rejectedCleaners") {
            vm.activeTab = vm.tabs[2].type;
        }
        else {
            vm.activeTab = vm.tabs[0].type
        }


        // Header
        vm.refreshFn = refreshFn;

        //methods
        vm.getUsers                = getUsers;
        vm.perPageChangeFn         = perPageChangeFn;
        vm.resetSearchFn           = resetSearchFn;
        vm.tabChangeFn             = tabChangeFn;
        vm.activeDeactiveFn        = activeDeactiveFn;
        vm.toggleBulkActiveFn      = toggleBulkActiveFn;
        vm.checkAllFn              = checkAllFn;
        vm.checkFn                 = checkFn;
        vm.selectBulkActionFn      = selectBulkActionFn;
        vm.updateExperienceLevelFn = updateExperienceLevelFn;
        vm.approveCleanerFn        = approveCleanerFn;

        // Bulk action types
        vm.bulkActionTypes = [
            {
                id                 : 1,
                name               : "Active/Deactive",
                icon               : "fa fa-check-square text-success",
                hasPermissionFilter: $scope.updatePermission
            },
            {
                id                 : 2,
                name               : "Experience Level",
                icon               : "icon-badge",
                hasPermissionFilter: $scope.updatePermission
            }
        ];

        // Active DeActive object
        vm.activeActionObj = {
            "activate"  : true,
            "deactivate": false
        };
        vm.activeAction    = "" + vm.activeActionObj.activate;

        (function () {
            getUsers();
        })();

        function perPageChangeFn(limit) {
            vm.page        = 1;
            vm.limit       = limit;
            vm.searchFocus = false;
            getUsers();
        }

        function getUsers(page) {
            var obj = {
                limit: parseInt(vm.limit),
                page : page || vm.page
            };

            vm.page = obj.page;
            if (vm.search) {
                obj.search       = {
                    "keys"   : ["name", "emails.email", "mobiles.mobile"],
                    "keyword": vm.search
                };
                vm.searchLoader  = true;
                vm.searchApplied = true;
            }
            else {
                vm.searchApplied = false;
            }
            if (vm.resetUsers) {//for reset list
                obj["page"]   = 1;
                obj.startWith = {};
            }

            if (vm.activeTab !== CleanerType.APPROVED) {
                obj.status = parseInt(vm.activeTab)
            }

            if (vm.limit == -1) {
                delete  obj.limit;
            }

            vm.totalCount   = 0;
            vm.mainList     = [];
            vm.show_loading = true;

            if (vm.activeTab !== CleanerType.APPROVED) {
                CleanerService.pendingRejectedCleanerList(obj)
                    .then(
                        function (res) {
                            res = res.data;
                            if (res.code === "OK") {
                                vm.mainList = res.data.list;

                                _.each(vm.mainList, function (data) {
                                    if (data && data.addresses && data.addresses.length) {
                                        let primaryAddress = _.findWhere(data.addresses, {isPrimary: true});
                                        if (primaryAddress) {
                                            data.primaryAddress = primaryAddress
                                        }
                                        else {
                                            data.primaryAddress = data.addresses[0];
                                        }
                                    }

                                    if (data && data.emails && data.emails.length) {
                                        let primaryEmail = _.findWhere(data.emails, {isPrimary: true});
                                        if (primaryEmail && primaryEmail.email) {
                                            data.email = encodeURIComponent(primaryEmail.email);
                                        }
                                    }
                                });
                                vm.totalCount        = res.data.count;
                                vm.list_showing_from = (vm.page - 1) * (vm.limit * 1) + 1;
                                vm.list_showing_to   = vm.list_showing_from - 1 + vm.mainList.length;
                                vm.resetUsers        = false;
                            }

                            vm.checkAll       = false;
                            vm.actionCheckBox = [];

                            vm.show_loading  = false;
                            vm.refreshLoader = false;
                            vm.searchLoader  = false;
                            vm.searchFocus   = true;

                        }, function (err) {
                            vm.refreshLoader = false;
                            vm.show_loading  = false;
                            vm.searchLoader  = false;
                            vm.searchFocus   = true;
                        }
                    );
            }
            else {
                CleanerService.approveCleanerList(obj)
                    .then(
                        function (res) {
                            res = res.data;
                            if (res.code === "OK") {
                                vm.mainList = res.data.list;

                                _.each(vm.mainList, function (data) {
                                    if (data && data.addresses && data.addresses.length) {
                                        let primaryAddress = _.findWhere(data.addresses, {isPrimary: true});
                                        if (primaryAddress) {
                                            data.primaryAddress = primaryAddress
                                        }
                                        else {
                                            data.primaryAddress = data.addresses[0];
                                        }
                                    }

                                    if (data && data.emails && data.emails.length) {
                                        let primaryEmail = _.findWhere(data.emails, {isPrimary: true});
                                        if (primaryEmail && primaryEmail.email) {
                                            data.email = encodeURIComponent(primaryEmail.email);
                                        }
                                    }
                                });
                                vm.totalCount        = res.data.count;
                                vm.list_showing_from = (vm.page - 1) * (vm.limit * 1) + 1;
                                vm.list_showing_to   = vm.list_showing_from - 1 + vm.mainList.length;
                                vm.resetUsers        = false;
                            }

                            vm.checkAll       = false;
                            vm.actionCheckBox = [];

                            vm.show_loading  = false;
                            vm.refreshLoader = false;
                            vm.searchLoader  = false;
                            vm.searchFocus   = true;

                        }, function (err) {
                            vm.refreshLoader = false;
                            vm.show_loading  = false;
                            vm.searchLoader  = false;
                            vm.searchFocus   = true;
                        }
                    );
            }


        }

        // Refresh the contents
        function refreshFn() {
            vm.search        = "";
            vm.searchFocus   = false;
            vm.refreshLoader = true;

            vm.checkAll       = false;
            vm.actionCheckBox = [];

            vm.page = 1;
            vm.getUsers(vm.page);
        }

        function activeDeactiveFn(value, id) {
            UserService
                .update(id, {isActive: value})
                .then(function (res) {
                    res = res.data;
                    if (res.code === "OK") {
                        _.each(vm.mainList, function (m, index) {
                            if (m.id === id) {
                                vm.mainList[index].isActive = value;
                            }
                        });
                        $scope.setFlash('s', res.message);
                    }
                }, function (err) {
                    if (err.data && err.data.message) {
                        $scope.setFlash('e', err.data.message);
                    }
                });
        }

        // Toggle bulk activate/deactivate
        function toggleBulkActiveFn() {
            let reqObj = {
                "ids"   : vm.actionCheckBox,
                "model" : "user",
                "status": {
                    "isActive": JSON.parse(vm.activeAction)
                }
            };

            CommonCrudService
                .bulkBooleanStatusUpdate(reqObj)
                .then(
                    function (res) {
                        if (res.code === "OK" && res.data && res.data.length) {
                            _.each(vm.mainList, function (user) {
                                if (vm.actionCheckBox.indexOf(user.id) !== -1) {
                                    user.isActive  = reqObj.status.isActive;
                                    user.isChecked = false;
                                }
                            });

                            $scope.setFlash("s", res.message);
                        }
                        else {
                            $scope.setFlash("e", res.message);
                        }

                        vm.activeAction = "" + vm.activeActionObj.activate;
                        angular.element("#bulk-active-deactive-modal").modal("hide");
                        vm.searchFocus = true;

                    }, function (err) {
                        vm.activeAction = "" + vm.activeActionObj.activate;
                        angular.element("#bulk-active-deactive-modal").modal("hide");
                        vm.searchFocus = true;
                        $scope.flashHttpErrorFn(err);
                    }
                );
        }

        function checkAllFn() {
            vm.actionCheckBox = [];
            if (vm.checkAll) {
                _.each(vm.mainList, function (user) {
                    vm.actionCheckBox.push(user.id);
                    user.isChecked = true;
                });
            }
            else {
                _.each(vm.mainList, function (user) {
                    user.isChecked = false;
                });
            }
        }

        function checkFn(userId, value) {
            if (!vm.actionCheckBox) {
                vm.actionCheckBox = [];
            }
            if (value) {
                vm.actionCheckBox.push(userId);
                vm.checkAll = (vm.actionCheckBox.length === vm.mainList.length);
            }
            else {
                var index = vm.actionCheckBox.indexOf(userId);
                vm.actionCheckBox.splice(index, 1);
                vm.checkAll = false;
            }
        }

        function selectBulkActionFn(type) {
            vm.searchFocus = false;

            if (type == 1) {
                angular.element("#bulk-active-deactive-modal").modal("show");
            }
            else if (type == 2) {
                updateExperienceLevelFn(true)
            }
        }

        function updateExperienceLevelFn(isModelOpen, id) {
            if (isModelOpen) {
                MasterService
                    .getMaster({masters: ["INCLUSION_LEVELS"], include: ["subMasters"]})
                    .then(
                        function (res) {
                            res = res.data;
                            if (res.code === "OK") {
                                if (res.data && res.data.INCLUSION_LEVELS && res.data.INCLUSION_LEVELS.subMasters) {
                                    vm.experienceLevels = res.data["INCLUSION_LEVELS"].subMasters;
                                }
                                else {
                                    vm.experienceLevels = [];
                                }

                            }
                        }, function (err) {
                            vm.experienceLevels = [];
                        }
                    );

                if (id && !_.isArray(id)) {
                    vm.actionCheckBox = [id];
                }
                vm.experienceLevel = '';
                angular.element("#experienceLevelUpdate").modal('show');
            }
            else {

                let obj = {
                    ids            : vm.actionCheckBox,
                    experienceLevel: vm.experienceLevel
                };

                CleanerService
                    .updateExperienceLevel(obj)
                    .then(function (res) {
                        res = res.data;
                        if (res.code === "OK") {
                            getUsers();
                            $scope.setFlash('s', res.message);
                            angular.element("#experienceLevelUpdate").modal('hide');
                        }
                    }, function (err) {
                        if (err.data && err.data.message) {
                            $scope.setFlash('e', err.data.message);
                        }
                    });
            }
        }

        function approveCleanerFn(isModelOpen, id) {
            if (isModelOpen) {
                vm.approveCleanerId = id;
                angular.element('#approveClenaer').modal('show');
            }
            else {
                let obj = {
                    cleanerId: id
                };
                CleanerService
                    .approveCleaner(obj)
                    .then(function (res) {
                        res = res.data;
                        if (res.code === "OK") {
                            getUsers();
                            $scope.setFlash('s', res.message);
                            angular.element("#approveClenaer").modal('hide');
                        }
                    }, function (err) {
                        if (err.data && err.data.message) {
                            $scope.setFlash('e', err.data.message);
                        }
                    });
            }

        }

        //Reset Search function
        function resetSearchFn() {
            vm.page        = 1;
            vm.search      = "";
            vm.searchFocus = false;
            vm.getUsers();
        }

        function tabChangeFn(type) {
            if (type === CleanerType.APPROVED) {
                $state.go('apps.users.approvedCleaners')
            }
            else if (type === CleanerType.PENDING_APPROVAL) {
                $state.go('apps.users.pendingApprovedCleaners')
            }
            else if (type === CleanerType.REJECTED) {
                $state.go('apps.users.rejectedCleaners')
            }

        }


    }
})();
