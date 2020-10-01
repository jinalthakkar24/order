(function () {
    'use strict';

    angular.module('app')
        .service('MasterService', MasterService);

    /* @ngInject */
    function MasterService($http) {
        return {
            list: function (obj) {
                return $http.post('/admin/master/paginate', obj);
            },
            remove: function (id) {
                return $http.delete('/admin/master/' + id);
            },
            update: function (id, obj) {
                return $http.put('/admin/master/' + id, obj);
            },
            create: function (obj) {
                return $http.post('/admin/master/create', obj)
            },
            setSequences: function (obj) {
                return $http.post('/admin/master/bulk-sequence-update', obj);
            },
            viewMaster: function (id) {
                return $http.get('/admin/master/' + id);
            },
            getMaster: function (obj) {
                return $http.post('/admin/master/list-by-code', obj);
            },
            deleteMaster: function (obj) {
                return $http.post('/admin/master/bulk-destroy', obj);
            },
            /**
             * Format Master and SubMaster according to require format
             * @param masters
             * @returns {{}}
             */
            formatMasters: (masters) => {
                let response = {};
                _.each(masters, function (master, key) {
                    response[key] = {};
                    _.each(master.subMasters, function (submaster, k) {
                        response[key][submaster.id] = submaster.name;
                    });
                });
                return response
            }
        }
    }
})();