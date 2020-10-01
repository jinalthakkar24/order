(function () {
    'use strict';

    angular.module('app')
        .service('UserService', UserService);

    /* @ngInject */
    function UserService($http) {
        return {
            list: function (obj) {
                return $http.post('/admin/user/paginate', obj);
            },
            remove: function (obj) {
                return $http.post('/admin/user/bulk-destroy', obj);
            },
            create: function (obj) {
                return $http.post('/admin/user/create', obj)
            },
            update: function (id, obj) {
                return $http.put('/admin/user/' + id, obj);
            },
            view: function (id) {
                return $http.get('/admin/user/' + id);
            },
            resetPassword: function (obj) {
                return $http.post('/admin/user/reset-password', obj)
            }
        }
    }
})();