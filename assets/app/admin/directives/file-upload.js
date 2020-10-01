(function () {
    'use strict';
    angular.module('app')
        .directive('fileUpload', function (httpPostFactory, Notification) {
            return {
                restrict: 'A',
                scope: {
                    isProcessing: "=",
                    callback: "&",
                    url: "="
                },
                link: function (scope, element, attr) {
                    element.bind('change', function () {
                        var formData = new FormData();
                        formData.append('file', element[0].files[0]);
                        scope.isProcessing = true;
                        httpPostFactory(scope.url, formData, function (err, res) {
                            if (err) {
                                scope.callback(err);
                            } else {
                                scope.callback(null, res);
                            }
                            // receive image name to use in a ng-src
                            scope.isProcessing = false;
                            angular.element(element).val('');
                        });
                    });

                }
            };
        })
        .factory('httpPostFactory', function ($http, Notification) {
            return function (file, data, callback) {
                $http({
                    url: file,
                    method: "POST",
                    data: data,
                    headers: {'Content-Type': undefined}
                }).then(function (res) {
                    res = res.data;
                    // if (res.code === 'OK') {
                    //     Notification.success({'message': res.message})
                    // }
                    callback(null, res);
                }, function (err) {
                    // Notification.error({'message': res.message})
                    callback(err)
                });
            };
        });
})();