(function () {
    'use strict';
    angular
        .module('AdminSetup.StyleGrid', [])
        .config(config);

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider
            .state('apps.adminSetup.styleGrid', {
                abstract: true,
                url: '/styleGrid'
            })
            .state('apps.adminSetup.styleGrid.list', {
                url: '/style',
                templateUrl: '/app/admin/admin-setup/styleGrid/list/styleGrid.html',
                controller: 'StyleGridController as vm'
            })
    }
})();