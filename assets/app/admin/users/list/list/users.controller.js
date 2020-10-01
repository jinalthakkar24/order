(function () {
    "use strict";
    angular
        .module("Users")
        .controller("UsersController", UsersController);

    /* @ngInject */
    function UsersController($scope, $state, $stateParams, $uibModal, Modules, UserTypes, ActiveFilterStatus,
                             LocalStorageService, Notification, UserService, CommonCrudService) {
        var vm = this;

        // Data
        vm.moduleData = Modules[$state.current.name];

        vm.searchFocus  = true;
        vm.isSuperAdmin = false;

        // Pagination - PAGE & LIMIT
        vm.page                   = 1;
        vm.limit                  = _.first($scope.defaultLimitRange).limit;
        var findDefaultLimitIndex = _.findIndex($scope.defaultLimitRange, {limit: vm.limit});
        vm.limitsArray            = $scope.defaultLimitRange.slice(findDefaultLimitIndex);

        vm.list_showing_from = 0;
        vm.list_showing_to   = 0;
        vm.totalCount        = 0;

        vm.userTypes = UserTypes;
        vm.cuType    = UserTypes.ADMIN;     // Current User Type

        if ($state.current.name === "apps.users.customers") {
            vm.cuType = UserTypes.CUSTOMER;
        }
        else if ($state.current.name === "apps.users.cleaners") {
            vm.cuType = UserTypes.CLEANER;
        }

        vm.showDeleteModal = false;
        let modalInstance  = null;

        vm.tabs = [
            {
                name: "All",
                type: ActiveFilterStatus.ALL
            },
            {
                name: "Active",
                type: ActiveFilterStatus.ACTIVE
            },
            {
                name: "Deactive",
                type: ActiveFilterStatus.DEACTIVE
            }
        ];

        if ($stateParams && $stateParams.tab) {
            vm.activeTab = $stateParams.tab
        }
        else {
            vm.activeTab = vm.tabs[0].type;
        }


        // Bulk action types
        vm.bulkActionTypes = [
            {
                id                 : 1,
                name               : "Delete",
                icon               : "fa fa-trash text-danger",
                hasPermissionFilter: $scope.deletePermission,
                tab                : UserTypes.ADMIN
            },
            {
                id                 : 2,
                name               : "Active/Deactive",
                icon               : "fa fa-check-square text-success",
                hasPermissionFilter: $scope.updatePermission
            },
            {
                id                 : 3,
                name               : "Assign Roles",
                icon               : "fa fa-key text-primary",
                hasPermissionFilter: $scope.updatePermission,
                tab                : UserTypes.ADMIN
            }
        ];

        // Active DeActive object
        vm.activeActionObj = {
            "activate"  : true,
            "deactivate": false
        };
        vm.activeAction    = "" + vm.activeActionObj.activate;

        vm.conference = LocalStorageService.get("conference-settings");

        // Header
        vm.refreshFn = refreshFn;
        vm.sortByFn  = sortByFn;

        //methods
        vm.getUsers                     = getUsers;
        vm.perPageChangeFn              = perPageChangeFn;
        vm.resetPasswordPopUp           = resetPasswordPopUp;
        vm.resetPassword                = resetPassword;
        vm.activeDeactiveFn             = activeDeactiveFn;
        vm.checkAllFn                   = checkAllFn;
        vm.checkFn                      = checkFn;
        vm.selectBulkActionFn           = selectBulkActionFn;
        vm.openViewModal                = openViewModal;
        vm.resetSearchFn                = resetSearchFn;
        vm.toggleBulkActiveFn           = toggleBulkActiveFn;
        vm.getRolesList                 = getRolesList;
        vm.getSelectedUserForRoleAssign = getSelectedUserForRoleAssign;
        vm.SelectedUserPermsChangeFn    = SelectedUserPermsChangeFn;
        vm.assignRolesFn                = assignRolesFn;

        /////////
        (function () {
            angular.element("#resetPsswordPopUP, #bulk-active-deactive-modal")
                .on("hidden.bs.modal", function () {
                    vm.searchFocus = true;
                });

            vm.isSuperAdmin = !!($scope.loginUser.type === UserTypes.SUPER_ADMIN);

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
                limit    : parseInt(vm.limit),
                page     : page || vm.page,
                isDeleted: false,
                filter   : {}
            };

            vm.page = obj.page;

            obj.filter.type = vm.cuType;
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
            vm.activeTabType = obj.filter.type;

            if (vm.limit == -1) {
                delete  obj.limit;
            }

            if (vm.activeTab != "-1") {
                obj.filter.isActive = JSON.parse(vm.activeTab);
            }

            let model = "user";
            if (vm.cuType === UserTypes.CUSTOMER) {
                model = "customer";
            }

            vm.totalCount   = 0;
            vm.mainList     = [];
            vm.show_loading = true;

            CommonCrudService
                .paginate(model, obj)
                .then(
                    function (res) {
                        if (res.code === "OK") {
                            vm.mainList          = res.data.list;
                            vm.totalCount        = res.data.count;
                            vm.list_showing_from = (vm.page - 1) * (vm.limit * 1) + 1;
                            vm.list_showing_to   = vm.list_showing_from - 1 + vm.mainList.length;
                            vm.resetUsers        = false;

                            _.each(vm.mainList, function (data) {
                                if (data && data.emails && data.emails.length) {
                                    let primaryEmail = _.findWhere(data.emails, {isPrimary: true});
                                    if (primaryEmail && primaryEmail.email) {
                                        data.email = encodeURIComponent(primaryEmail.email);
                                    }
                                }
                            });
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

                        //$scope.flashHttpErrorFn(err);
                    }
                );
        }

        // Refresh the contents
        function refreshFn() {
            vm.search        = "";
            vm.searchFocus   = false;
            vm.refreshLoader = true;

            vm.checkAll       = false;
            vm.actionCheckBox = [];

            vm.activeTab = "-1";
            vm.sortBy    = {};


            vm.page = 1;
            vm.getUsers(vm.page);
        }

        //Reset Search function
        function resetSearchFn() {
            vm.page        = 1;
            vm.search      = "";
            vm.searchFocus = false;
            vm.getUsers();
        }

        /**
         * Open Reset Password Pop Up
         * @param {String} id
         * @param {String} name
         */
        function resetPasswordPopUp(id, name) {
            vm.searchFocus = false;
            angular.element("#resetPsswordPopUP").modal("show");
            vm.resetPasswordData = {
                name: name,
                id  : id
            };
        }

        // Sort contents
        function sortByFn(key, type, all = false) {
            vm.mainList = _.sortBy(vm.mainList, function (i) {
                return i[key].toLowerCase();
            });

            if (all) {
                type = (type && type == 1) ? -1 : 1;
            }

            vm.sortBy      = {};
            vm.sortBy[key] = type;
            vm.sortBy.type = type;

            if (type == -1) {
                vm.mainList.reverse();
            }
        }

        /**
         * Reset Password for user
         */
        function resetPassword() {
            UserService.resetPassword({id: vm.resetPasswordData.id, newPassword: vm.password})
                .then(function (res) {
                    res = res.data;
                    if (res.code === "OK") {
                        Notification.success({"message": res.message});
                    }
                    vm.password        = '';
                    vm.confirmPassword = '';
                    angular.element("#resetPsswordPopUP").modal("hide");
                    $('#password-strength-label').text('');
                    $("#password-strength-label").removeClass("p15 btn-rounded");
                    $('.strength-meter-fill').removeAttr('data-strength');


                }, function (err) {
                    vm.searchFocus = true;
                    if (err.data && err.data.message) {
                        Notification.error({"message": err.data.message});
                    }
                });
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
                        Notification.success({"message": res.message});
                    }
                }, function (err) {
                    if (err.data && err.data.message) {
                        Notification.error({"message": err.data.message});
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
                                    user.isActive = reqObj.status.isActive;
                                }
                            });

                            $scope.setFlash("s", res.message);
                        }
                        else {
                            $scope.setFlash("e", res.message);
                        }
                        vm.checkAll = false;
                        checkAllFn();

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


        function setScrollOnMultipleActionFn() {
            let pnlHdrHeight = $("#pnlHdr").outerHeight(true);
            let pnlFtrHeight = $("#pnlFtr").outerHeight(true);
            let heightForm   = pnlHdrHeight + pnlFtrHeight + 20;
            let finalHeight  = window.innerHeight - heightForm;

            $("#pnlBody").css("max-height", finalHeight);
            $("#pnlBody1").css("max-height", finalHeight);

            //$('#productDiv').css('height', finalProductHeight);
            $("#pnlBody").css("overflow-y", "auto");
            $("#pnlBody1").css("overflow-y", "auto");


        }

        $(window).resize(function () {
            setScrollOnMultipleActionFn();
        });

        setTimeout(function () {
            $("#bulk-roles-assign-modal").on("shown.bs.modal", function () {
                setScrollOnMultipleActionFn();
            });
        }, 1000);

        function getSelectedUserForRoleAssign(ids) {
            if (ids && ids.length) {
                vm.selectedUserList = [];
                _.each(ids, function (id) {
                    let user = _.findWhere(vm.mainList, {id: id});
                    if (user && user.id) {
                        vm.selectedUserList.push(user);
                    }
                });
                SelectedUserPermsChangeFn();

            }
            else {
                vm.selectedUserList = [];
            }
        }

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

            vm.getSelectedUserForRoleAssign(vm.actionCheckBox);

        }

        function SelectedUserPermsChangeFn() {
            let tmpChkUsers              = angular.copy(vm.selectedUserList);
            vm.selectedUserForAssignRole = _.where(tmpChkUsers, {"isChecked": true});
        }

        function selectBulkActionFn(type) {
            vm.searchFocus = false;

            if (type == 1) {
                $scope.deleteDocument({
                    documentId: vm.actionCheckBox,
                    model     : "user",
                    title     : "User",
                    noDelete  : true
                }, {listCount: vm.mainList.length, pageNo: vm.page}, vm.getUsers);
            }
            else if (type == 2) {
                angular.element("#bulk-active-deactive-modal").modal("show");
            }
            else if (type == 3) {
                vm.getRolesList();
                vm.roles = [];
                angular.element("#bulk-roles-assign-modal").modal("show");

            }
        }

        function assignRolesFn() {
            if (vm.selectedUserForAssignRole && vm.selectedUserForAssignRole.length) {
                let ids = _.pluck(vm.selectedUserForAssignRole, "id");

                let obj              = {
                    ids  : ids,
                    roles: vm.roles
                };
                vm.assignRoleLoading = true;

                UserService
                    .assignRoles(obj)
                    .then(function (res) {
                        vm.assignRoleLoading = false;
                        res                  = res.data;
                        if (res.code === "OK") {
                            if (res.data && res.data.length) {
                                $scope.setFlash("s", res.message);
                            }
                            else {
                                $scope.setFlash("e", res.message);
                            }
                        }
                        angular.element("#bulk-roles-assign-modal").modal("hide");
                    });


            }
            else {
                angular.element("#bulk-roles-assign-modal").modal("hide");
            }
        }

        function openViewModal(user) {
            vm.searchFocus = false;

            modalInstance = $uibModal.open({
                ariaLabelledBy : "modal-title",
                ariaDescribedBy: "modal-body",
                templateUrl    : "/app/admin/users/list/view/user-view.html",
                controller     : "UsersViewModalController",
                controllerAs   : "vm",
                size           : "lg",
                appendTo       : angular.element("body"),
                resolve        : {
                    userID: function () {
                        return user;
                    }
                }
            });

            modalInstance.result.then(function (data) {

            }, function () {
                // This is compulsory, otherwise you'll get
                // Possibly unhandled rejection: cancel undefined
            });
        }


        // Clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });
    }

})();