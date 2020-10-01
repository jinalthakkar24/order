(function () {
    'use strict';
    angular
        .module('Auth', [
            'Auth.login',
            'Auth.forgotPassword',
            'Auth.resetPassword',
            'Auth.verifyOTP'
        ])
        .config(config);

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider
            .state('auth', {
                abstract: true,
                url: '/auth',
                controller:'BackCssCtrl as vm',
                resolve: {
                    auth: function (AuthService, $state, $http, $q) {
                        var token = AuthService.getToken();
                        var deferred = $q.defer();
                        if (token && token !== "") {
                            $http.get('/auth/validate_token').then(function (res) {
                                res = res.data;
                                if (res.code === 'OK') {
                                    $state.go('apps.users.list');
                                    deferred.resolve();
                                } else {
                                    deferred.resolve();
                                }
                            }, function (err) {
                                deferred.resolve();
                            });
                        } else {

                            deferred.resolve();
                        }
                        return deferred.promise;
                    }
                }
            })
            .state('auth.login', {
                url: '/login',
                templateUrl: '/app/admin/auth/login/login.html',
                controller: 'LoginController as vm',
            })
            .state('auth.forgotPassword', {
                url: '/forgot-password',
                templateUrl: '/app/admin/auth/forgot-password/forgot-password.html',
                controller: 'ForgotPasswordController as vm'
            })
            .state('auth.resetPassword', {
                url: '/reset-password/:token',
                templateUrl: '/app/admin/auth/reset-password/reset-password.html',
                controller: 'ResetPasswordController as vm'
            })
            .state('auth.verifyOTP', {
                url: '/verify-otp/:mobile',
                templateUrl: '/app/admin/auth/verify-otp/verify-otp.html',
                controller: 'VerifyOTPController as vm'
            })
            .state('auth.verifyEmail', {
                url: '/verify-email/:token',
                templateUrl: '/app/admin/auth/verify-otp/verify-otp.html',
                controller: 'VerifyOTPController as vm'
            });
    }
})();
