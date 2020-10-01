(function () {
    'use strict';
    /**
     * Config for the router
     */
    angular.module('app')
        .run(run)
        .config(config);

    /* @ngInject */
    function config($stateProvider, $urlRouterProvider) {
        var layout = "/app/shared/tpl/app.html";
        if (window.location.href.indexOf("material") > 0) {
            layout = "/app/tpl/blocks/material.layout.html";
            $urlRouterProvider
                .otherwise('/auth/login');
        } else {
            $urlRouterProvider
                .otherwise('/auth/login');    // Default login
        }

        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                templateUrl: layout,

            })
            .state('apps', {
                abstract: true,
                url: '/apps',
                templateUrl: '/app/shared/tpl/layout.html',
                resolve: {
                    auth: function (AuthService, $state, $q, $http) {
                        var token = AuthService.getToken();
                        var deferred = $q.defer();
                        if (token && token !== '') {
                            $http.get('/auth/validate_token').then(function (res) {
                                res = res.data;
                                if (res.code === 'OK') {
                                    deferred.resolve();
                                }
                                else {
                                    AuthService.logout();
                                    deferred.resolve();
                                }
                            }, function (err) {
                                AuthService.logout();
                                deferred.resolve();
                            });
                        }
                        else {
                            $state.go('auth.login');
                            deferred.reject();
                        }
                        return deferred.promise;
                    }
                }
            })
    }

    /* @ngInject */
    function run($rootScope, $state, AuthService, $http) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $state.params;
        var token = AuthService.getToken();
        if (token) {
            $http.defaults.headers.common['Authorization'] = 'JWT ' + token;
        }
    }
})();
