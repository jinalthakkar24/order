(function () {
    'use strict';
    angular.module('app')
        .directive('nksOnlyNumber', nksOnlyNumber)
        .directive('nksOnlyNumberAllowComma', nksOnlyNumberAllowComma)
        .directive('focusMe', focusMe)
        .directive('myEnter', myEnter)

        .directive("hasPermission", hasPermission);

    /* @ngInject */
    function nksOnlyNumber() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                /**
                 * Change value to a valid number
                 * @author: Bhargav
                 * @date: 16-02-2018
                 */
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

    /* @ngInject */
    function nksOnlyNumberAllowComma() {
        return {
            restrict: 'EA',
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    var spiltArray = String(newValue).split("");
                    if (attrs.allowNegative == "false") {
                        if (spiltArray[0] == '-') {
                            newValue = newValue.replace("-", "");
                            ngModel.$setViewValue(newValue);
                            ngModel.$render();
                        }
                    }

                    if (attrs.allowDecimal == "false") {
                        if (newValue) {
                            newValue = parseInt(newValue);
                            ngModel.$setViewValue(newValue);
                            ngModel.$render();
                        }
                    }

                    if (attrs.allowDecimal != "false") {
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
                            if (_.isString(newValue) && newValue.charAt(0) == '0') {
                                while (newValue.charAt(0) === '0')
                                    newValue = newValue.substr(1);
                            }
                            //newValue = newValue.toString();
                            if (newValue * 1 > attrs.allowMax * 1 || newValue * 1 > 100) {
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
                        if (attrs.allowComma != "false") {
                            if (spiltArray.indexOf(',') != -1) {
                                if (spiltArray && spiltArray.length) {
                                    if ((spiltArray[spiltArray.length - 2] == ',' && spiltArray[spiltArray.length - 1] == ',')) {
                                        ngModel.$setViewValue(oldValue);
                                        ngModel.$render();
                                    }

                                    if ((isNaN(spiltArray[spiltArray.length - 1]) && spiltArray[spiltArray.length - 1]) != ','
                                        && !isNumber(spiltArray[spiltArray.length - 1])) {
                                        ngModel.$setViewValue(oldValue);
                                        ngModel.$render();
                                    }
                                }
                            }
                            else {
                                ngModel.$setViewValue(oldValue);
                                ngModel.$render();
                            }
                        }
                        else {
                            ngModel.$setViewValue(oldValue);
                            ngModel.$render();
                        }
                    }
                    if (angular.isUndefined(newValue)) {
                        ngModel.$setViewValue('');
                        ngModel.$render();
                    }
                });
            }
        };
    }

    /* @ngInject */
    function focusMe($timeout, $parse) {
        return {
            link: function (scope, element, attrs) {
                var model = $parse(attrs.focusMe);
                scope.$watch(model, function (value) {
                    //console.log('value=', value);
                    if (value === true) {
                        $timeout(function () {
                            element[0].focus();
                        });
                    }
                });
                /*element.bind('blur', function () {
                    console.log('blur');
                    scope.$apply(model.assign(scope, false));
                });*/
            }
        };
    }

    /* @ngInject */
    function myEnter() {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    }

    /* @ngInject */
    function hasPermission(permissions) {
        return {
            link: function (scope, element, attrs) {
                if (!_.isString(attrs.hasPermission)) {
                    throw "hasPermission value must be a string";
                }
                var value = attrs.hasPermission.trim();
                var module = attrs.hasModule * 1;
                var notPermissionFlag = value[0] === "!";
                if (notPermissionFlag) {
                    value = value.slice(1).trim();
                }

                function toggleVisibilityBasedOnPermission() {
                    var hasPermission = permissions.hasPermission(value, module);
                    if ((hasPermission && !notPermissionFlag) || (!hasPermission && notPermissionFlag)) {
                        element[0].style.display = (attrs.displayType ? attrs.displayType : "inline-block");
                    }
                    else {
                        element[0].style.display = "none";
                    }
                }

                toggleVisibilityBasedOnPermission();
                scope.$on("permissionsChanged", toggleVisibilityBasedOnPermission);
            }
        };
    }
})();