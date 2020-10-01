(function () {
    'use strict';
    angular
        .module('AdminSetup.Settings', [])
        .controller('SettingsController', SettingsController)
        .service('DevelopAPIService', DevelopAPIService);

    /* @ngInject */
    function SettingsController($scope, $state, Modules) {

        var vm = this;
        //data
        vm.moduleData = Modules[$state.current.name];
        //methods


        ///////////////

        //clear vm
        $scope.$on('$destroy', function () {
            vm = []
        });
    }

    /* @ngInject */
    function DevelopAPIService($http) {
        return {
            createCSV: function (obj) {
                return $http.post('/develop/create-csv', obj);
            },
            matchRecords: function () {
                return $http.post('/develop/match-records');
            },
            rapMatchRecords: function () {
                return $http.post('/develop/rap-match-records');
            },
            checkDuplicateRecords: function () {
                return $http.post('/develop/duplicate-records');
            },
            trunkRapPrice: function () {
                return $http.post('/develop/trunk-rap-price');
            },
            trunkDiscountPrice: function () {
                return $http.post('/develop/trunk-discount-price');
            }

        }
    }
})();