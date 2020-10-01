(function () {
    'use strict';
    angular.module('app')
        .directive('fileReader', function (CommonService) {
            return {
                scope: {
                    fileReader: "="
                },
                link: function (scope, element) {
                    $(element).on('change', function (changeEvent) {
                        var files = changeEvent.target.files;
                        if (files.length) {
                            var r = new FileReader();
                            r.onload = function (e) {
                                var contents = e.target.result;
                                var data = CommonService.csvToArray(contents);
                                scope.$apply(function () {
                                    if (data.length > 0) {
                                        scope.fileReader = data.splice(0, data.length - 1);
                                    }
                                });
                            };
                            r.readAsText(files[0]);
                        }
                    });
                }
            };
        });
})();