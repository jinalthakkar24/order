(function () {
    'use strict';
    angular
        .module('Auth.resetPassword', [])
        .controller('ResetPasswordController', ResetPasswordController);

    /* @ngInject */
    function ResetPasswordController($scope, $state, Notification, AuthService) {
        var vm = this;


        //data
        vm.user = {};

        //methods
        vm.resetPassword = resetPassword;
        /////////

        function resetPassword() {
            var obj = {
                token: $state.params.token,
                newPassword: vm.user.newPassword
            };

            AuthService
                .resetPassword(obj)
                .then(function (res) {
                        var res = res.data;
                        if (res.data && res.code === 'OK') {
                            vm.user = {};
                            Notification.success({message: res.message});
                            $state.go('auth.login');
                        }
                    },
                    function (err) {
                        if (err.data && err.data.message) {
                            Notification.error({message: err.data.message});
                        }
                    });
        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }

})();
