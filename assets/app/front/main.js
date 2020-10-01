const DEFAULT_ATTACHMENT_REPOSITORY_URL = "http://localhost:1370";
(function () {
    'use strict';
    /* Controllers */
    angular.module('app')
        .controller('AppCtrl', AppCtrl);

    /* @ngInject */
    function AppCtrl($scope) {
        // config
        $scope.app = {
            name: 'Conference',
            version: '1.0.0',
            settings: {
                themeID: 1,
                navbarHeaderColor: 'bg-danger',
                navbarCollapseColor: 'bg-white-only',
                asideColor: 'bg-dark',
                headerFixed: true,
                asideFixed: false,
                asideFolded: false,
                asideDock: false,
                container: false
            },
            hideFooter: true
        };
        //methods
        ////////////////
        (function () {

        })();

        //clear vm
        $scope.$on('$destroy', function() {
            vm = []
        });
    }
})();