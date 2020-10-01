(function () {
    'use strict';
    angular
        .module('app')
        .factory("permissions", permissions);

    /* @ngInject */
    function permissions($rootScope) {
        var permissionList = [];
        return {
            setPermissions: function (permissions) {
                permissionList = permissions;
                $rootScope.$broadcast("permissionsChanged");
            },
            hasPermission: function (permission, module) {
                permission = permission.trim();
                if (permissionList && permissionList.length) {
                    return permissionList.some(item => {
                        if (item["module"] === module && item["permissions"][permission]) { // item.Name is only used because when I called setPermission, I had a Name property
                            return true;
                            // return item.Name.trim() === permission;
                        }
                        else {
                            return false;
                        }
                    });
                }
                else {
                    return true;
                }
            }
        };
    }
})();