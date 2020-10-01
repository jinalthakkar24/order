(function () {
    'use strict';
    /* Controllers */
    angular.module('app')
        .controller('AppCtrl', AppCtrl)
        .controller("BackCssCtrl", BackCssCtrl);

    /* @ngInject */
    function AppCtrl($scope, CommonService, MODULE, UserTypes, LocalStorageService, AuthService, UserPermissionService, Notification, DeleteDocumentService, $state) {
        // config
        $scope.app = {
            name: 'Sample',
            version: '1.0.0',
            settings: {
                themeID: 1,
                navbarHeaderColor: 'bg-danger',
                navbarCollapseColor: 'bg-white-only',
                asideColor: 'bg-dark',
                headerFixed: true,
                asideFixed: false,
                asideFolded: false,
                asideDock: false,
                container: false
            },
            hideFooter: true
        };
        // Permission
        $scope.insertPermission = "insert";
        $scope.updatePermission = "update";
        $scope.deletePermission = "delete";
        $scope.listPermission = "list";
        $scope.uploadExcelPermission = "uploadExcel";

        $scope.notInsertPermission = "!insert";
        $scope.notUpdatePermission = "!update";
        $scope.notDeletePermission = "!delete";
        $scope.notListPermission = "!list";
        $scope.notUploadExcelPermission = "!uploadExcel";

        $scope.defaultLimitRange = [
            {limit: "25"},
            {limit: "50"},
            {limit: "100"},
            {limit: "200"},
            {limit: "500"},
            {limit: "1000"}
        ];
        //methods
        $scope.logout = logout;
        $scope.checkMenuActiveFn = checkMenuActiveFn;
        $scope.deleteDocument = DeleteDocumentService.openModal;
        $scope.setFlash = setFlash;
        $scope.flashHttpErrorFn = flashHttpErrorFn;
        $scope.bindDateRangePickerClick = bindDateRangePickerClick;
        $scope.setNavPermissions = setNavPermissions;
        $scope.displayImages            = CommonService.displayImages;
        ////////////////
        (function () {
            if (MODULE) {
                $scope.masterModuleConstant = {};
                _.each(MODULE, function (module) {
                    $scope.masterModuleConstant[module.identity] = module.module;
                });
            }
            $scope.loginUser = AuthService.getUser();
            if ($scope.loginUser && $scope.loginUser.type !== UserTypes.SUPER_ADMIN) {
                let isExpiredPermissions = UserPermissionService.validatePermissions();
                if (isExpiredPermissions) {
                    $scope.logout();
                }
                else {
                    $scope.setNavPermissions();
                }
            }
            /* Get Nav Menu */
            CommonService
                .navMenu()
                .then(function (data) {
                    if (data && data.data.navMenu && data.data.navMenu.length) {
                        $scope.navMenu = data.data.navMenu;
                        if ($scope.navMenu && $scope.navMenu.length) {
                            $scope.navMenu = _.sortBy($scope.navMenu, 'sequence');
                        }
                    }
                    else {
                        $scope.navMenu = [];
                    }
                });
        })();

        /**
         * Logout user
         */
        function logout() {
            AuthService.removeToken();
            $state.go('auth.login');
        }

        /*Check Menu Active*/

        function checkMenuActiveFn(menu) {
            if (menu && menu.active_states && menu.active_states.length) {
                if ($state && $state.current && $state.current.name) {
                    var current_state = $state.current.name;
                    if (menu && menu.active_states)
                        return $.inArray(current_state, menu.active_states) > -1;
                }
            }
        };

        /**
         * Binds the date range picker custom click event.
         * @Author: Bhargav
         * @Date: 28-07-2018
         */
        function bindDateRangePickerClick() {
            setTimeout(function () {
                angular.element('.drpicker i').on('click', function () {
                    $(this).parent().find('input').click();
                });
            }, 1000);
        }

        // Notification
        function setFlash(mtype, msg, position = {x: null, y: null}, replace = false) {
            let type,
                obj = {message: msg, title: "", replaceMessage: true};

            if (position.x) {
                obj.positionX = position.x;
            }
            if (position.y) {
                obj.positionY = position.y;
            }
            if (replace) {
                obj.replaceMessage = true;
            }

            switch (mtype) {
                case "s" :
                    type = "success";
                    return Notification.success(obj);
                    break;
                case "e" :
                    type = "error";
                    return Notification.error(obj);
                    break;
                case "w" :
                    type = "warning";
                    return Notification.warning(obj);
                    break;
                case "i" :
                    type = "info";
                    return Notification.info(obj);
                    break;
                case "p" :
                    type = "primary";
                    return Notification.primary(obj);
                    break;
            }
        }

        function flashHttpErrorFn(resError, currScope = $scope, falsyArr = []) {
            var error = resError.data || {},
                msg = (
                    error.code ?
                        error.code + ":<br/>" + error.message :
                        resError.status + ":<br/>" + resError.statusText
                );
            $scope.setFlash("e", msg);

            angular.forEach(falsyArr, function (_varName) {
                currScope[_varName] = false;
            });
        }

        function setNavPermissions() {

            /* Get Nav Menu */
            CommonService
                .navMenu()
                .then(function (data) {
                    if (data && data.data.navMenu && data.data.navMenu.length) {
                        $scope.navMenu = data.data.navMenu;
                        if ($scope.navMenu && $scope.navMenu.length) {
                            $scope.navMenu = _.sortBy($scope.navMenu, "sequence");
                        }

                        if ($scope.loginUser && $scope.loginUser.type !== UserTypes.SUPER_ADMIN) {
                            let permission = LocalStorageService.get("permissions");
                            let decryptedPermissions = CryptoJS.AES.decrypt(permission, "snapAcleaner");
                            let userPermissions = decryptedPermissions.toString(CryptoJS.enc.Utf8);
                            userPermissions = _.isString(userPermissions) && !_.isEmpty(userPermissions) ? JSON.parse(userPermissions) : userPermissions;
                            if (userPermissions && userPermissions.permissions && userPermissions.permissions.length) {
                                userPermissions = userPermissions.permissions;
                                permissions.setPermissions(userPermissions);
                            }

                            if (userPermissions && userPermissions.length) {
                                let viewGroups = [];
                                _.each($scope.navMenu, function (menu) {
                                    let group = {};
                                    if (menu && (menu.is_line || menu.level)) {
                                        if (menu.is_line) {
                                            viewGroups.push({line: menu.sequence, permissionsModule: []});
                                        }

                                        if (menu.level) {
                                            viewGroups.push({level: menu.sequence, permissionsModule: []});
                                        }

                                    }
                                    else {
                                        group = _.last(viewGroups);
                                        if (group && group.line && menu.is_title) {
                                            group["title"] = menu.sequence;
                                        }

                                        if (group && group.level && menu.is_title) {
                                            group["title"] = menu.sequence;
                                        }
                                    }

                                    if (menu && menu.child_states && menu.child_states.length) {
                                        if (menu && menu.isOnlyForSuperAdmin) {
                                            menu.is_block = true;

                                        }
                                        else {
                                            let dt = _.findWhere(userPermissions, {navBarId: menu.module});
                                            if (dt) {
                                                if (dt && dt.permissions && dt.permissions.list) {
                                                    menu.is_block = false;
                                                    if (group && group.permissionsModule) {
                                                        group.permissionsModule.push(menu);
                                                    }
                                                }
                                                else {
                                                    menu.is_block = true;
                                                }
                                            }
                                            else {
                                                _.each(menu.child_states, function (cs) {
                                                    if (cs && cs.isOnlyForSuperAdmin) {
                                                        cs.is_block = true;
                                                    }
                                                    else {
                                                        let dataFind = _.findWhere(userPermissions, {navBarId: cs.module});
                                                        if (dataFind) {
                                                            if (dataFind && dataFind.permissions && dataFind.permissions.list) {
                                                                cs.is_block = false;
                                                                if (group && group.permissionsModule) {
                                                                    group.permissionsModule.push(cs);
                                                                }
                                                            }
                                                            else {
                                                                cs.is_block = true;


                                                            }
                                                        }
                                                        else {
                                                            if ((!userPermissions || !userPermissions.length) && group && group.permissionsModule) {
                                                                group.permissionsModule.push(menu);
                                                            }
                                                        }
                                                    }

                                                });

                                                let blockedState = _.where(menu.child_states, {is_block: true});
                                                if (menu.child_states && blockedState && (menu.child_states.length === blockedState.length)) {
                                                    menu.is_block = true;
                                                }
                                            }
                                        }

                                    }
                                    else {
                                        if (menu && menu.isOnlyForSuperAdmin) {
                                            menu.is_block = true;
                                        }
                                        else {
                                            let dataFind = _.findWhere(userPermissions, {navBarId: menu.module});
                                            if (dataFind) {
                                                if (dataFind && dataFind.permissions && dataFind.permissions.list) {
                                                    menu.is_block = false;
                                                    if (group && group.permissionsModule) {
                                                        group.permissionsModule.push(menu);
                                                    }
                                                }
                                                else {
                                                    menu.is_block = true;

                                                }
                                            }
                                            else {
                                                if ((!userPermissions || !userPermissions.length) && group && group.permissionsModule) {
                                                    group.permissionsModule.push(menu);
                                                }
                                            }
                                        }


                                    }

                                    if (group && (group.line || group.level)) {
                                        if (group.line) {
                                            let findIndexOfGroup = _.findIndex(viewGroups, {line: group.line});
                                            if (findIndexOfGroup >= 0) {
                                                viewGroups[findIndexOfGroup] = group;
                                            }
                                        }

                                        if (group.level) {
                                            let findIndexOfGroup = _.findIndex(viewGroups, {level: group.level});
                                            if (findIndexOfGroup >= 0) {
                                                viewGroups[findIndexOfGroup] = group;
                                            }
                                        }

                                    }
                                });

                                _.each(viewGroups, function (group) {
                                    if (group && group.line && group.title) {
                                        if (group && group.permissionsModule && !group.permissionsModule.length) {
                                            let findTitleIndex = _.findIndex($scope.navMenu, {sequence: group.title});
                                            if (findTitleIndex >= 0) {
                                                $scope.navMenu[findTitleIndex].is_title = false;
                                            }

                                            let findLine = _.findIndex($scope.navMenu, {sequence: group.line});
                                            if (findLine >= 0) {
                                                $scope.navMenu[findLine].is_line = false;
                                            }

                                        }
                                    }
                                    if (group && group.line && !group.title) {
                                        if (group && group.permissionsModule && !group.permissionsModule.length) {
                                            let findLine = _.findIndex($scope.navMenu, {sequence: group.line});
                                            if (findLine >= 0) {
                                                $scope.navMenu[findLine].is_line = false;
                                            }

                                        }
                                    }

                                    if (group && group.level) {
                                        if (group && group.permissionsModule && !group.permissionsModule.length) {
                                            let findLine = _.findIndex($scope.navMenu, {sequence: group.level});
                                            if (findLine >= 0) {
                                                $scope.navMenu[findLine].level = false;
                                            }

                                        }
                                    }
                                });
                            }
                        }

                    }
                    else {
                        $scope.navMenu = [];
                    }
                });
        }

        $scope.$on('$destroy', function () {
            vm = [];
        });
    }

    /* @ngInject */
    function BackCssCtrl($scope, $state) {
        (function () {
            var stateName = $state.current.name;
            /*'Auth.login',
             'Auth.forgotPassword',
             'Auth.resetPassword',
             'Auth.verifyOTP'*/
            if (stateName == "auth.login" ||
                stateName == "Auth.forgotPassword" ||
                stateName == "Auth.resetPassword" ||
                stateName == "Auth.verifyOTP") {
                $scope.app.stateName = true;
            }
            else {
                $scope.app.stateName = false;
            }
            console.log("state", $state.current.name);
        })();
    }
})();
