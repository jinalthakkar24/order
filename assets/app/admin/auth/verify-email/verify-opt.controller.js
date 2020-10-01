(function () {
    'use strict';
    angular
        .module('Auth.verifyOTP', [])
        .controller('VerifyOTPController', VerifyOTPController);

    /* @ngInject */
    function VerifyOTPController($scope, $state, $stateParams, AuthService) {
        var vm = this;


        //data
        vm.isOTPSent = false;
        vm.isOTPVerified = false;
        vm.user = {};


        //methods
        vm.verifyOtp = verifyOTP;

        /////////

        function verifyOTP() {
            var obj = {
                code: vm.user.verificationCode,
                mobile: $stateParams.mobile
            };
            AuthService
                .verifyOTP(obj)
                .then(function (res) {
                    res = res.data;
                    if (res.data && res.code === 'OK') {
                        $scope.setFlash('s', res.message);
                        $state.go('auth.resetPassword', {token: vm.user.verificationCode});
                    }
                }, function (err) {
                    $scope.flashHttpErrorFn(err);
                });
        }

        $scope.$on('$destroy', function () {
            vm = [];
        });
    }

})();
