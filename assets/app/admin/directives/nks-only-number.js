(function () {
    'use strict';
    angular.module('app')
        .directive('nksOnlyNumber', nksOnlyNumber);

    /* @ngInject */
    function nksOnlyNumber() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                angular.element(element).on('blur', function () {
                    var x = this.value;
                    if (isNaN(x)) {
                        ngModel.$setViewValue(0);
                        ngModel.$render();
                    }
                    else {
                        x = parseFloat(x);
                        ngModel.$setViewValue(x);
                        ngModel.$render();
                    }
                });

                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    var spiltArray = String(newValue).split("");
                    var changeValue = angular.copy(newValue);

                    if (attrs.allowNegative == "false") {
                        if (spiltArray[0] == '-') {
                            newValue = newValue.replace("-", "");
                            changeValue = newValue;
                            ngModel.$setViewValue(newValue);
                            ngModel.$render();
                        }
                    }
                    changeValue = String(changeValue);

                    if (attrs.allowDecimal == "false") {
                        if (changeValue) {
                            var allValues = (changeValue).split('.');
                            ngModel.$setViewValue(allValues[0]);
                            ngModel.$render();
                        }
                        if (attrs.allowZero && attrs.allowZero == "false") {
                            if (newValue == 0 || newValue == "0") {
                                ngModel.$setViewValue("");
                                ngModel.$render();
                            }
                        }
                    }

                    if (attrs.allowDecimal != "false") {
                        if (attrs.allowZero && attrs.allowZero == "false") {
                            if (newValue == 0 || newValue == "0") {
                                ngModel.$setViewValue("");
                                ngModel.$render();
                            }
                        }

                        if (attrs.decimalUpto) {
                            var n = String(newValue).split(".");
                            if (n[1]) {
                                var n2 = n[1].slice(0, attrs.decimalUpto);
                                newValue = [n[0], n2].join(".");
                                ngModel.$setViewValue(newValue);
                                ngModel.$render();
                            }
                        }
                    }

                    if (attrs.allowMax) {
                        if (newValue) {
                            //Commented by hardik - in this 0 not allowed on 1st position - and we want to set 0 as 1st position
                            /*if (_.isString(newValue) && newValue.charAt(0) == '0') {
                             while (newValue.charAt(0) === '0')
                             newValue = newValue.substr(1);
                             }*/
                            //newValue = newValue.toString();
                            if (newValue * 1 > attrs.allowMax * 1) {
                                ngModel.$setViewValue(0);
                                ngModel.$render();
                            }
                            else {
                                ngModel.$setViewValue(newValue);
                                ngModel.$render();
                            }
                        }
                    }

                    /**
                     * Validate for minimum value
                     * @author: Bhargav
                     * @date: 16-02-2018
                     */
                    if (attrs.allowMin) {
                        if (newValue) {
                            if (newValue * 1 < attrs.allowMin * 1) {
                                ngModel.$setViewValue(0);
                                ngModel.$render();
                            }
                            else {
                                ngModel.$setViewValue(newValue);
                                ngModel.$render();
                            }
                        }
                    }

                    if (spiltArray.length === 0) return;
                    if (spiltArray.length === 1 && (spiltArray[0] == '-' || spiltArray[0] === '.')) return;
                    if (spiltArray.length === 2 && newValue === '-.') return;

                    /*Check it is number or not.*/
                    if (isNaN(newValue)) {
                        ngModel.$setViewValue(oldValue);
                        ngModel.$render();
                    }

                    if (angular.isUndefined(newValue)) {
                        ngModel.$setViewValue('');
                        ngModel.$render();
                    }
                });
            }
        };
    }
})();