(function () {
    'use strict';

    angular.module('app')
        .service('AuthService', AuthService);

    /* @ngInject */
    function AuthService($http, $state, $localStorage) {
        return {
            login: function (obj) {
                return $http.post('/auth/login', obj);
            },
            logout: function () {
                $localStorage.token = null;
                $localStorage.user = null;
                $state.go('auth.login');
            },
            setToken: function (token, user) {
                $localStorage.token = token;
                $localStorage.user = JSON.stringify(user);
            },
            getToken: function () {
                return $localStorage.token;
            },
            getUser: function () {
                return JSON.parse($localStorage.user);
            },
            removeToken: function () {
                $localStorage.token = null;
                $localStorage.user = null;
            },
            forgotPassword: function (obj) {
                return $http.post('/auth/forgot-password', obj);
            },
            verifyOTP: function (obj) {
                return $http.post('/auth/check-otp', obj);
            },
            resetPassword: function (obj) {
                return $http.post('/auth/reset-password', obj);
            }
        }
    }
})();
