(function () {
    'use strict';
    angular
        .module('app')
        .controller('excelOperationController', excelOperationController)
        .component('excelOperation', {
            bindings: {
                model: '<',
                grid: '<',
                sampleUrl: '<',
                callback: '&'
            },
            templateUrl: '/app/admin/components/excel-operation/excel-operation.html',
            controller: 'excelOperationController as vm'
        });

    /* @ngInject */
    function excelOperationController($scope, $http, Notification) {

        var vm = this;
        //data

        //methods
        vm.$onInit = initialize;
        vm.importExcel = importExcel;
        vm.downloadExcelFn = downloadExcelFn;
        vm.afterUploadCallback = afterUploadCallback;

        /////////////


        function initialize() {
            vm.importUrl = '/admin/file-operator/import-excel?model=' + vm.model;
        }

        function downloadExcelFn() {
            var url = '/admin/file-operator/export-excel?model=' + vm.model;
            if (vm.grid) {
                url += '&grid=true';
            }
            $http
                .get(url)
                .then(function (res) {
                    res = res.data;
                    if (res.code === 'OK') {
                        vm.callback({data: res.data});
                        downloadFile(res.data.data);
                    }
                }, function (err) {
                    err = err.data;
                    Notification.error({message: err.message});
                });
        }

        function downloadFile(path) {
            var link = document.createElement('a');
            link.setAttribute('href', path);
            link.setAttribute('download', vm.model + '.xlsx');
            link.setAttribute('style', 'display:hidden;');
            document.body.appendChild(link); // Required for FF
            link.click();
        }

        function importExcel() {
            angular.element('.file-reader').trigger('click');
        }

        function afterUploadCallback(err, result) {

            if (!err) {
                Notification.success({message: result.message, delay: 8000});
            } else {
                err = err.data;
                Notification.error({message: err.message, delay: 8000});
            }
            vm.callback();
        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });

    }
})();
