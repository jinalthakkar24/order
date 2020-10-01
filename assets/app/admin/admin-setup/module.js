(function () {
    'use strict';
    angular
        .module('AdminSetup', [
            'AdminSetup.Masters',
            'AdminSetup.Notification',
            'AdminSetup.Settings',
            'AdminSetup.StyleGrid'
        ])
        .config(config);

    /* @ngInject */
    function config($stateProvider) {
        $stateProvider
            .state('apps.adminSetup', {
                abstract: true,
                url: '/admin-setup'
            })
            .state('apps.adminSetup.notifications', {
                url: '/notifications',
                templateUrl: '/app/admin/admin-setup/notifications/notifications.html',
                controller: 'NotificationsCtrl as vm'
            })
            .state('apps.adminSetup.settings', {
                url: '/settings',
                templateUrl: '/app/admin/admin-setup/settings/settings.html',
                controller: 'SettingsController as vm'
            })
            .state('apps.adminSetup.test', {
                url: '/test',
                templateUrl: '/app/admin/admin-setup/test/test.html',
                controller: 'TestController as vm'
            });
    }
})();