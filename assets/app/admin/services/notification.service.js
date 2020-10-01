(function () {
    'use strict';

    angular.module('app')
        .service('NotificationService', NotificationService);

    /* @ngInject */
    function NotificationService($http) {
        return {
            list: function (obj) {
                return $http.post('/admin/notification/paginate', obj);
            },
            remove: function (id) {
                return $http.delete('/admin/notification/' + id);
            },
            update: function (id, obj) {
                return $http.put('/admin/notification/' + id, obj);
            }
        }
    }
})();