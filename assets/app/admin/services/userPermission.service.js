(function () {
    'use strict';

    angular.module('app')
        .service('UserPermissionService', UserPermissionService);

    /* @ngInject */
    function UserPermissionService($http, $state, $localStorage, $q, LocalStorageService, permissions) {
        return {

            setPermission: function (permissionsArray) {
                let expireTime      = moment().add(2, 'h').valueOf();
                let clonedPermissionArray = _.clone(permissionsArray);
                let encryptedPermission = CryptoJS.AES.encrypt(JSON.stringify(permissionsArray), "snapAcleaner").toString();
                LocalStorageService.set('permissions', encryptedPermission);
                LocalStorageService.set('expireTime', expireTime);
                permissions.setPermissions(clonedPermissionArray);

            },

            getUserPermissions: function (userId) {
                let deferred = $q.defer();
                let obj      = {
                    userId: userId
                };
                $http.post('/admin/roles/user-permission', obj).then(function (response) {
                        response = response.data;
                        if (response.code === 'OK') {
                            if (response.data.data
                                && response.data.data.length) {
                                deferred.resolve(response.data.data)
                            }
                            else {
                                deferred.resolve()
                            }
                        }
                        else {
                            deferred.resolve()
                        }
                    },
                    function (err) {
                        err = err.data;
                        deferred.reject(err)
                    });
                return deferred.promise;
            },

            validatePermissions: function () {
                let expireTime = parseInt(LocalStorageService.get('expireTime'));
                return expireTime ? moment(moment().valueOf()).isSameOrAfter(expireTime) : false;

            }
        }
    }

})();

