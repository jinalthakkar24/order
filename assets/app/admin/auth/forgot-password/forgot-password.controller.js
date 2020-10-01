(function () {
    'use strict';
    angular
        .module('Auth.forgotPassword', [])
        .controller('ForgotPasswordController', ForgotPasswordController);

    /* @ngInject */
    function ForgotPasswordController($scope, $state, AuthService) {
        var vm = this;
        //data
        vm.user = {};
        vm.type = 'email';
        vm.isOTPSent = false;
        //methods
        vm.forgotPassword = forgotPassword;

        /////////

        function forgotPassword() {
            if (vm.type === 'email') {
                var obj = {
                    username: vm.user.email
                };

                AuthService
                    .forgotPassword(obj)
                    .then(function (res) {
                        res = res.data;
                        if (res.data && res.code === 'OK') {
                            $scope.setFlash('s', res.message);
                        }
                    }, function (err) {
                        $scope.flashHttpErrorFn(err);
                    });
            } else {
                var obj = {
                    mobile: vm.user.mobile
                };

                AuthService
                    .sendOTP(obj)
                    .then(function (res) {
                        res = res.data;
                        if (res.data && res.code === 'OK') {
                            $scope.setFlash('s', res.message);
                        }
                        vm.isOTPSent = true;
                        $state.go('auth.verifyOTP', {mobile: vm.user.mobile});
                    }, function (err) {
                        $scope.flashHttpErrorFn(err);
                    });
            }

        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }
})();
