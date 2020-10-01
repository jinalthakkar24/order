(function () {
    'use strict';

    angular.module('app', [
        'ngAnimate',
        'ngAria',
        'ngCookies',
        'ngMessages',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ngStorage',
        'as.sortable',
        'ui.bootstrap.datetimepicker',
        'ui.router',
        'ui.select',
        'ui.bootstrap',
        'ui.utils',
        'oc.lazyLoad',
        'ui-notification',
        'ngAvatar',
        "ngIntlTelInput",
        'AdminSetup',
        'blockUI',
        'angular.filter',
        'constant',
        'Auth',
        "Users"
    ]).config(config);

    /* @ngInject */
    function config(NotificationProvider) {
        NotificationProvider.setOptions({
            delay: 10000,
            startTop: 20,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'left',
            positionY: 'bottom'
        });
    }
})();