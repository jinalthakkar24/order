(function () {
    'use strict';
    angular
        .module('app')
        .controller('MobilesController', MobilesController)
        .component('multipleMobiles', {
            bindings: {
                form: '<',
                array: '=',
                arrayList: '=',
                isPrimaryMobile: '=',
                isRequired: '<',
                max: '<',
                id: '<'
            },
            templateUrl: '/app/admin/components/multiple-mobiles/mobiles.html',
            controller: 'MobilesController as vm'
        });

    /* @ngInject */
    function MobilesController($scope, Notification, $timeout) {

        var vm = this;
        //data

        //methods
        vm.getData = getData;
        vm.changeFn = changeFn;
        vm.addNextIfValidFn = addNextIfValidFn;
        vm.addNextValueFn = addNextValueFn;
        vm.removeThisValueFn = removeThisValueFn;
        vm.$onInit = initialize;

        //get data and return data of selected country for error message
        function getData(ind) {
            var countryDetails = $('#cell' + ind).intlTelInput('getSelectedCountryData');
            var placeHolder = document.getElementById("cell" + ind).getAttribute("placeholder");
            var countryData = {countryDetails: countryDetails, placeHolder: placeHolder};
            return countryData;
        }

        //Change mobile function
        function changeFn(array, newMobile) {
            //Clear all notification messages if alive
            Notification.clearAll();

            //Check for duplicate mobiles
            if (newMobile && newMobile.mobile) {
                //uniqMobiles : uniq mobiles
                var uniqMobiles = _.uniq(array, function (cell) {
                    return cell.mobile;
                });

                //If uniq mobiles length and array length is different >> Entered mobile is duplicate
                if (uniqMobiles.length != array.length) {
                    vm.isDuplicate = true;

                    //Find data >> which is duplicate with current entered mobile
                    var sameMobiles = _.where(array, {mobile: newMobile.mobile});
                    if (sameMobiles && sameMobiles.length > 1) {
                        newMobile.isDuplicate = true;
                        //Notification.error({message: "This number is duplicate. Please change it."});
                    }
                }
                else {
                    vm.isDuplicate = false;

                    //Else find a data which has isDuplicate key >> Remove that key
                    var dupMobile = _.findWhere(array, {isDuplicate: true});
                    if (dupMobile)
                        delete dupMobile.isDuplicate;

                }
            }
            else {
                vm.isDuplicate = false;

                //Else find a data which has isDuplicate key >> Remove that key
                var dupMobile = _.findWhere(array, {isDuplicate: true});
                if (dupMobile)
                    delete dupMobile.isDuplicate;
            }

            //Find data which has undefined mobile or no mobile
            var isBlank = _.filter(array, function (num) {
                return !num.mobile || num.mobile == '' || num.mobile == null || num.mobile == undefined;
            });

            //If some data has no valid mobile >> add button disabled
            if (isBlank && isBlank.length) {
                vm.addDisabled = true;
            }
            else {
                vm.addDisabled = false;
            }

            //If max number of length is there >> then check validation for length
            if (vm.max) {
                var arrayLength = vm.arrayList.length;
                if (arrayLength == vm.max) {
                    vm.addDisabled = true;
                }
                else {
                    vm.addDisabled = false;
                }
            }
        }

        //Add new mobile
        function addNextValueFn() {

            //If max number of length is there >> then check validation for length
            if (vm.max) {
                var arrayLength = vm.arrayList.length;
                if (arrayLength == vm.max) {
                    vm.addDisabled = true;
                    return true;
                }
                else {
                    vm.addDisabled = false;
                }
            }

            //Generate random id for reference
            var id = Math.floor(Math.random() * (999 - 100 + 1) + 100);
            vm.arrayList.push({id: id});

            /////////////////////////////////// FOCUS /////////////////////////////////////////
            vm.focusMobile = {};
            var newIndex = _.findLastIndex(vm.arrayList);
            var key = 'cell' + newIndex;
            vm.focusMobile[key] = true;

            //Check for mobiles >> duplicate mobiles || blank mobiles
            changeFn(vm.arrayList);
        }

        //Check if any row has invalid mobile >> then focus on it o/w add next mobile number
        function addNextIfValidFn(mobile) {
            if (mobile) {
                //Find data which has undefined mobile or no mobile
                var isBlank = _.filter(vm.arrayList, function (num) {
                    return !num.mobile || num.mobile == '' || num.mobile == null || num.mobile == undefined;
                });

                //If any entry is blank then focus to that row
                if (isBlank && isBlank.length) {
                    /////////////////////////////////// FOCUS /////////////////////////////////////////
                    vm.focusMobile = {};
                    $timeout(function () {
                        var newIndex = _.findIndex(vm.arrayList, function (num) {
                            return !num.mobile || num.mobile == '' || num.mobile == null || num.mobile == undefined;
                        });
                        var key = 'cell' + newIndex;
                        vm.focusMobile[key] = true;
                    }, 500);
                }
                else {
                    //Else got for new entry of mobile number
                    addNextValueFn();
                }
            }
        }

        //Remove mobile entry
        function removeThisValueFn(dataId, key_index, is_primary_index) {

            //If multiple mobiles are there >> find index to delete and delete it from array
            if (vm.arrayList && vm.arrayList.length > 1) {
                var index = _.findIndex(vm.arrayList, {id: dataId});
                if (index > -1)
                    vm.arrayList.splice(index, 1);

                //Changes to primary radio button check on delete mobile
                //If remove data is set as primary by default then >> change primary to other
                if (key_index == is_primary_index) {
                    if (key_index != 0) {
                        key_index--;
                    }
                    vm.isPrimaryMobile = key_index + '';
                }
                else if (key_index < is_primary_index) {
                    //If remove index is lesser than set primary index >> then set primary will not change
                    //So, remove a data means >> primary index will decrease by 1
                    var primaryInd = parseInt(is_primary_index);
                    primaryInd--;
                    vm.isPrimaryMobile = primaryInd + '';
                }
            }
            else {
                //If a single mobile is there >> you want to remove that mobile >> then (mobile = null) only
                vm.arrayList[key_index].mobile = null;
            }

            /////////////////////////////////// FOCUS /////////////////////////////////////////
            vm.focusMobile = {};

            $timeout(function () {
                var newIndex = _.findLastIndex(vm.arrayList);
                var key = 'cell' + newIndex;
                vm.focusMobile[key] = true;
            }, 200);


            //Check for mobiles >> duplicate mobiles || blank mobiles
            changeFn(vm.arrayList);
        }

        //Init function
        function initialize() {

            //On change country >> this will call
            setTimeout(function () {
                $(document).on("countrychange", "input[id^='cell']", function (e) {
                    var id = e.currentTarget.id;
                    var currentCellIndex = parseInt(id.replace(/^\D+/g, ''));
                    if (currentCellIndex > -1) {
                        var isValid = $('#' + id).intlTelInput("isValidNumber");
                        //If input has mobile number >> remove it and get error for selected country
                        if (e && e.currentTarget && e.currentTarget.value) {
                            if (!isValid) {
                                /*if (vm.array[currentCellIndex].mobile) {*/
                                $('#' + id).intlTelInput("setNumber", "");

                                /////////////////////////////////// FOCUS /////////////////////////////////////////
                                vm.focusMobile = {};
                                $timeout(function () {
                                    $('#' + id).trigger('input');
                                    var key = 'cell' + currentCellIndex;
                                    vm.focusMobile[key] = true;
                                }, 500);
                                /*}*/
                            }
                        }
                        else {

                            /////////////////////////////////// FOCUS /////////////////////////////////////////
                            vm.focusMobile = {};

                            //else change event fire
                            $timeout(function () {
                                $('#' + id).trigger('change');
                                var key = 'cell' + currentCellIndex;
                                vm.focusMobile[key] = true;
                            }, 100);
                        }
                    }
                });
            }, 1000);
        }


        $scope.$watch('vm.array', function (value) {
            if (value && !value.length && !vm.id) {
                var id = Math.floor(Math.random() * (999 - 100 + 1) + 100);
                vm.arrayList = [{id: id}];
                vm.isPrimaryMobile = '0';
            }
            else {
                if (vm.id) {
                    vm.arrayList = [];
                    //At edit time : array have already values then give uniq id to each record
                    _.each(vm.array, function (num) {
                        if (num.mobile) {
                            var id = Math.floor(Math.random() * (999 - 100 + 1) + 100);
                            num.id = id;
                        }
                        vm.arrayList.push({id: id});
                    });
                    if (vm.arrayList && vm.arrayList.length) {
                        $timeout(function () {
                            //At edit time : array have already values then give uniq id to each record
                            _.each(vm.array, function (num, indexMobile) {
                                var temp_num = angular.copy(num.mobile);
                                num.mobile = $('#cell' + indexMobile).intlTelInput('setNumber', temp_num);
                            });

                            //At edit time : do input trigger to every number
                            _.each(vm.array, function (num, indexMobile) {
                                $('#cell' + indexMobile).trigger('input');
                            });

                            var primaryMobileInd = _.findIndex(vm.array, {isPrimary: true});
                            if (primaryMobileInd > -1) {
                                var primaryIndex = primaryMobileInd + '';
                                vm.isPrimaryMobile = angular.copy(primaryIndex);
                            }
                        }, 500);
                    }
                }
            }
        });

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });
    }
})();