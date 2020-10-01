(function () {
    'use strict';
    angular
        .module('app')
        .factory('apiToken', ['clientId', function apiTokenFactory(clientId) {

            var secret = window.localStorage.getItem('myApp.secret');
            var apiToken = encrypt(clientId, secret);

            return apiToken;
        }]);
})();