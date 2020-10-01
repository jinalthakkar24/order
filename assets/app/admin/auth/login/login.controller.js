(function () {
    'use strict';
    angular
        .module('Auth.login', [])
        .controller('LoginController', LoginController);

    /* @ngInject */
    function LoginController($scope, AuthService, $state, $http,UserPermissionService) {
        var vm = this;

        //data

        //methods
        vm.login = login;

        /////////

        (function () {
            var $input = $('input.form-control');

            setInterval(function () {
                $input.trigger('change');
            }, 500);
        })();

        function login() {

            AuthService.login({username: vm.email, password: vm.password}).then(function (res) {
                res = res.data;
                if (res.code === 'OK') {
                    if (res.data && res.data.userPermissions) {
                        UserPermissionService.setPermission(res.data.userPermissions);
                        $scope.setNavPermissions();
                    }
                    AuthService.setToken(res.data.token.jwt, res.data.user);
                    $http.defaults.headers.common['Authorization'] = 'JWT ' + res.data.token.jwt;
                    $state.go('apps.adminSetup.mainMasters');
                }
                vm.errorMsg = '';
            }, function (err) {
                err         = err.data;
                vm.errorMsg = err.message;
            });
        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }

})();
