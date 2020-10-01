(function () {
    'use strict';
    angular.module('app')
        .directive('confirmDelete', confirmDelete)

    /* @ngInject */
    function confirmDelete() {
        return {
            template: '<div class="modal" id="DeleteModal" tabindex="-1" data-backdrop="static" aria-hidden="true">' +
            '<div class="modal-dialog" style="margin:10px auto;width:70%">' +
            '<div class="portlet">' +
            '<div class="portlet-body">' +
            '<div class="wrapper-xs">' +
            '<div class="row">' +
            '<div class="col-sm-12" style="padding:10%">' +
            '<div class="panel panel-default" style="position: relative;">' +
            '<div class="panel-body">' +
            '<div class="form-group pull-in clearfix" style="font-size:22px">' +
            '<div class="col-md-12 wrapper-xs text-dark text-center"><span class="text-danger"></span> &nbsp; {{message}}</div>' +
            '<div class="col-md-11 m-t-xs m-l-lg text-md text-center" ng-if="description" ' +
            'style="word-break: break-all;color:#777"> {{description}}</div>' +
            '</div>' +
            '<div class="form-group pull-in clearfix">' +
            '<div class="text-right m-t">' + '<center>' +
            '<button type="submit"  ng-click = "confirmdeleteFn()" class = "btn btn-success m-r-xs" style="width:11%">  {{"Yes"}} </button >' +
            '<button type="submit"  ng-click = "canceldeleteFn()" class = "btn btn-danger" style="width:11%">  {{"No"}} </button >' +
            '</center>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                /*delete confirm fn*/
                scope.confirmdeleteFn = function () {
                    if (attrs.confirmDeleteFn) {
                        scope.$eval(attrs.confirmDeleteFn);
                        $(element).modal('hide');
                    }
                };

                /*cancel modal  fn*/
                scope.canceldeleteFn = function () {
                    if (attrs.cancelDeleteFn) {
                        scope.$eval(attrs.cancelDeleteFn);
                        $(element).modal('hide');
                    } else {
                        $(element).modal('hide');
                    }
                };

                scope.$watch(attrs.visible, function (value) {
                    scope.message = attrs.message || 'Are you sure want to delete ?';
                    scope.description = attrs.description;
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    // scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                    // });
                });

                $(element).on('hidden.bs.modal', function () {
                    //scope.$apply(function () {

                    scope.$parent[attrs.visible] = false;
                    //});
                });

                element.bind("keydown keypress", function (event) {
                    if (event.which === 27) {
                        scope.$apply(function () {
                            scope.$eval(attrs.cancelDeleteFn);
                        });
                        event.preventDefault();
                    }
                });

            }
        };
    }
})();