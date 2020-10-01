(function () {
    'use strict';
    angular
        .module('AdminSetup')
        .controller('TestController', TestController);

    function TestController($scope) {
        var vm = this;
        // var socket = io();
        // socket.connect();
        // // Add a connect listener
        // socket.on('connect',function() {
        //     console.log('Client has connected to the server!');
        // });
        // Clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });
    }
})();