(function () {
    "use strict";

    angular
        .module("app")
        .service("CommonCrudService", CommonCrudService);

    /* @ngInject */
    function CommonCrudService($http) {
        return {
            paginate               : function (model, obj) {
                return $http.post("/admin/" + model + "/paginate", obj).then(function (res) {
                    return res.data;
                });
            },
            view                   : function (model, id) {
                return $http.get("/admin/" + model + "/" + id).then(function (res) {
                    return res.data;
                });
            },
            upsert                 : function (model, obj) {
                return $http.post("/admin/" + model + "/upsert", obj).then(function (res) {
                    return res.data;
                });
            },
            create                 : function (model, obj) {
                return $http.post("/admin/" + model + "/create", obj).then(function (res) {
                    return res.data;
                });
            },
            update                 : function (model, id, obj) {
                return $http.put("/admin/" + model + "/" + id, obj).then(function (res) {
                    return res.data;
                });
            },
            multipleUpdate         : function (model, obj) {
                return $http.post("/admin/" + model + "/bulk-update", obj).then(function (res) {
                    return res.data;
                });
            },
            multipleDestroy        : function (model, obj) {
                return $http.post("/admin/" + model + "/bulk-destroy", obj).then(function (res) {
                    return res.data;
                });
            },
            updateSequence         : function (model, obj) {
                return $http.post("/admin/" + model + "/update-sequence", obj).then(function (res) {
                    return res.data;
                });
            },
            activeDeactive         : function (obj) {
                return $http.post("/admin/common/bulk-active-deactive", obj).then(function (res) {
                    return res.data;
                });
            },
            bulkBooleanStatusUpdate: function (obj) {
                return $http.post("/admin/common/bulk-boolean-status-update", obj).then(function (res) {
                    return res.data;
                });
            },
            exportExcel            : function (obj) {
                return $http.post("/admin/file-operator/export-excel", obj).then(function (res) {
                    return res.data;
                });
            }
        };
    }
})();