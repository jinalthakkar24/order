(function () {
    'use strict';
    angular
        .module('AdminSetup.Notification', [])
        .controller('NotificationsCtrl', NotificationsCtrl);

    /* @ngInject */
    function NotificationsCtrl($state, Modules, NotificationService, Notification, $scope) {
        var vm = this;

        //data
        vm.moduleData = Modules[$state.current.name];
        vm.page = 1;
        vm.limit = '25';


        //methods
        vm.getList = getList;
        vm.perPageChangeFn = perPageChangeFn;
        /////////
        (function () {
            getList(null);
        })();

        function perPageChangeFn() {
            vm.page = 1;
            getList();
        }

        function _afterDelete() {
            var remained = (vm.page * vm.listIndex) / parseInt(vm.limit);
            if (remained !== 0 && remained % 1 === 0) {
                vm.page = remained;
            } else {
                vm.page = Math.floor(remained) + 1;
            }
            getList();
        }

        function getList() {

            var obj = {
                page: vm.page,
                limit: vm.limit
            }


            NotificationService.list(obj).then(function (res) {
                res = res.data;
                vm.mainList = [];
                if (res.code === 'OK') {
                    vm.mainList = res.data.list;
                    vm.totalCount = res.data.count;
                    vm.list_showing_from = (vm.page - 1) * (vm.limit * 1) + 1;
                    vm.list_showing_to = vm.list_showing_from - 1 + vm.mainList.length;
                    vm.resetUsers = false;
                }
                vm.show_loading = false;
            }, function (err) {
                err = err.data;
                if (err.code === 'E_NOT_FOUND') {
                    vm.mainList = [];
                }
                vm.show_loading = false;
            });
        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }

})();