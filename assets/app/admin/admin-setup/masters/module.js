(function () {
    "use strict";
    angular
        .module("AdminSetup.Masters", [])
        .config(config);

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider
            .state("apps.adminSetup.mainMasters", {
                url        : "/masters",
                templateUrl: "/app/admin/admin-setup/masters/mainMasters/mainMasters.html",
                controller : "MastersController as vm"
            })
            .state("apps.adminSetup.subMasters", {
                url        : "/sub-masters/:masterId",
                templateUrl: "/app/admin/admin-setup/masters/subMasters/subMasters.html",
                controller : "SubMastersController as vm",
                params     : {
                    masterId: {squash: true, value: null}
                }
            });
    }

})();