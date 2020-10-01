(function () {
    "use strict";
    angular
        .module("Users", [])
        .config(config);

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider
            .state("apps.users", {
                abstract: true,
                url     : "/users"
            })
            .state("apps.users.list", {
                url        : "/list",
                templateUrl: "/app/admin/users/admin/admin.html",
                controller : "UsersController as vm"
            })
            .state("apps.users.upsert", {
                url        : "/upsert/:userId",
                templateUrl: "/app/admin/users/list/upsert/user-upsert.html",
                controller : "UserUpsertController as vm",
                params     : {
                    userId: {squash: true, value: null}
                }
            })
            .state("apps.users.profile", {
                url        : "/profile",
                templateUrl: "/app/admin/users/list/profile/profile.html",
                controller : "UserProfileController as vm"
            })
            .state("apps.users.view", {
                url        : "/view/:userId",
                templateUrl: "/app/admin/users/list/view/user-view.html",
                controller : "UserViewController as vm",
                params     : {
                    userId: {squash: true, value: null}
                },
                resolve    : {
                    navMenu       : function ($http) {
                        return $http.get("/data/navbar.json");
                    },
                    projectModules: function ($http) {
                        return $http.post("/admin/projectModule/paginate");
                    }
                }
            });
    }
})();