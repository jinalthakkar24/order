(function () {
    "use strict";
    angular
        .module("app")
        .controller("EmailsController", EmailsController)
        .component("multipleEmails", {
            bindings   : {
                form          : "<",
                array         : "=",
                isPrimaryEmail: "=",
                isRequired    : "<",
                max           : "<",
                id            : "<"
            },
            templateUrl: "/app/admin/components/multiple-emails/emails.html",
            controller : "EmailsController as vm"
        });

    /* @ngInject */
    function EmailsController($scope, Notification, REGEX_COLLECTION, $timeout) {

        var vm          = this;
        let pattern     = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        vm.emailPattern = new RegExp(pattern, "i");

        //methods
        vm.changeFn          = changeFn;
        vm.addNextIfValidFn  = addNextIfValidFn;
        vm.addNextValueFn    = addNextValueFn;
        vm.removeThisValueFn = removeThisValueFn;
        vm.$onInit           = initialize;

        //Change email funtion
        function changeFn(array, newEmail) {
            //Clear all notification messages if alive
            Notification.clearAll();

            //Check for duplicate emails
            if (newEmail && newEmail.email) {
                //uniqEmails : uniq emails
                var uniqEmails = _.uniq(array, function (mail) {
                    return mail.email;
                });

                //If uniq emails length and array length is different >> Entered email is duplicate
                if (uniqEmails.length != array.length) {
                    vm.isDuplicate = true;

                    //Find data >> which is duplicate with current entered email
                    var sameEmails = _.where(array, {email: newEmail.email});
                    if (sameEmails && sameEmails.length > 1) {
                        newEmail.isDuplicate = true;
                        //Notification.error({message: "This email is duplicate. Please change it."});
                    }
                }
                else {
                    vm.isDuplicate = false;

                    //Else find a data which has isDuplicate key >> Remove that key
                    var dupEmail = _.findWhere(array, {isDuplicate: true});
                    if (dupEmail)
                        delete dupEmail.isDuplicate;

                }
            }
            else {
                vm.isDuplicate = false;

                //Else find a data which has isDuplicate key >> Remove that key
                var dupEmail = _.findWhere(array, {isDuplicate: true});
                if (dupEmail)
                    delete dupEmail.isDuplicate;
            }

            //Find data which has undefined email or no email
            var isBlank = _.filter(array, function (mail) {
                return !mail.email || mail.email == "" || mail.email == null || mail.email == undefined;
            });

            //If some data has no valid email >> add button disabled
            if (isBlank && isBlank.length) {
                vm.addDisabled = true;
            }
            else {
                vm.addDisabled = false;
            }

            //If max number of length is there >> then check validation for length
            if (vm.max) {
                var arrayLength = vm.array.length;
                if (arrayLength == vm.max) {
                    vm.addDisabled = true;
                }
                else {
                    vm.addDisabled = false;
                }
            }
        }

        //Add new email
        function addNextValueFn() {

            //If max number of length is there >> then check validation for length
            if (vm.max) {
                var arrayLength = vm.array.length;
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
            vm.array.push({id: id});

            /////////////////////////////////// FOCUS /////////////////////////////////////////
            vm.focusEmail      = {};
            var newIndex       = _.findLastIndex(vm.array);
            var key            = "email" + newIndex;
            vm.focusEmail[key] = true;

            //Check for emails >> duplicate emails || blank emails
            changeFn(vm.array);
        }

        //Check if any row has invalid email >> then focus on it o/w add next email
        function addNextIfValidFn(email) {
            if (email) {
                //Find data which has undefined email or no email
                var isBlank = _.filter(vm.array, function (num) {
                    return !num.email || num.email == "" || num.email == null || num.email == undefined;
                });

                if (isBlank && isBlank.length) {
                    /////////////////////////////////// FOCUS /////////////////////////////////////////
                    vm.focusEmail = {};
                    $timeout(function () {
                        var newIndex       = _.findIndex(vm.array, function (num) {
                            return !num.email || num.email == "" || num.email == null || num.email == undefined;
                        });
                        var key            = "email" + newIndex;
                        vm.focusEmail[key] = true;
                    }, 500);

                }
                else {
                    addNextValueFn();
                }
            }
        }

        //Remove email entry
        function removeThisValueFn(dataId, key_index, is_primary_index) {

            //If multiple emails are there >> find index to delete and delete it from array
            if (vm.array && vm.array.length > 1) {
                var index = _.findIndex(vm.array, {id: dataId});
                if (index > -1)
                    vm.array.splice(index, 1);

                //Changes to primary radio button check on delete email
                //If remove data is set as primary by default then >> change primary to other
                if (key_index == is_primary_index) {
                    if (key_index != 0) {
                        key_index--;
                    }
                    vm.isPrimaryEmail = key_index + "";
                }
                else if (key_index < is_primary_index) {
                    //If remove index is lesser than set primary index >> then set primary will not change
                    //So, remove a data means >> primary index will decrease by 1
                    var primaryInd = parseInt(is_primary_index);
                    primaryInd--;
                    vm.isPrimaryEmail = primaryInd + "";
                }
            }
            else {
                //If a single email is there >> you want to remove that email >> then (email = null) only
                vm.array[key_index].email = null;
            }

            /////////////////////////////////// FOCUS /////////////////////////////////////////
            vm.focusEmail = {};

            $timeout(function () {
                var newIndex       = _.findLastIndex(vm.array);
                var key            = "email" + newIndex;
                vm.focusEmail[key] = true;
            }, 200);


            //Check for emails >> duplicate emails || blank emails
            changeFn(vm.array);
        }

        //Init function
        function initialize() {
        }

        $scope.$watch("vm.array", function (value) {
            if (value && !value.length && !vm.id) {
                var id            = Math.floor(Math.random() * (999 - 100 + 1) + 100);
                vm.array          = [{id: id}];
                vm.isPrimaryEmail = "0";
            }
            else {
                if (vm.id) {
                    //At edit time : array have already values then give uniq id to each record
                    _.each(vm.array, function (mail) {
                        var id  = Math.floor(Math.random() * (999 - 100 + 1) + 100);
                        mail.id = id;
                    });

                    $timeout(function () {
                        var primaryEmailInd = _.findIndex(vm.array, {isPrimary: true});
                        if (primaryEmailInd > -1) {
                            vm.isPrimaryEmail = primaryEmailInd + "";
                        }
                    }, 500);
                }
            }
        });

        //clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });
    }
})();