(function () {
    "use strict";
    angular
        .module("Users")
        .controller("CustomerViewCtrl", CustomerViewCtrl);

    /* @ngInject */
    function CustomerViewCtrl($scope, $state, $filter, Modules, JobRequestStatuses, CustomerData, UserService, JobComplaintDisputeStatus,stripStatus, CommonCrudService) {

        var vm = this;

        vm.moduleData = Modules[$state.current.name];

        if (!(CustomerData && CustomerData.data)) {
            $scope.setFlash("e", "Something bad happened. Please contact admin.");
            $state.go("apps.users.customers");
            return;
        }

        vm.staticTabs = [
            {"id": 1, "name": "Jobs", "code": "JOBS"},
            {"id": 2, "name": "Complaint / Dispute", "code": "DISPUTE"},
            {"id": 3, "name": "Payments", "code": "PAYMENTS"},
            {"id": 4, "name": "KYC & Password", "code": "KYC_PASSWORD"}
        ];

        vm.activeTab = 1;
        vm.data      = CustomerData.data;

        vm.complaintPage             = 1;
        vm.JobCompalintDisputeStatus = {};
        _.each(JobComplaintDisputeStatus, function (status) {
            vm.JobCompalintDisputeStatus[status.code] = status.id;
        });

        if (JobRequestStatuses) {
            vm.jobStatus = {};
            _.each(JobRequestStatuses, function (status) {
                vm.jobStatus[status.code] = status.id
            })
        }

        // KYC & Password tab
        vm.passForm = {"showPassword": false};

        vm.changePasswordFn      = changePasswordFn;

        // get complaint dispute
        vm.getComplaintDisputeFn = getComplaintDisputeFn;
        vm.viewMoreComplaintFn   = viewMoreComplaintFn;
        vm.closeAllPopoverFn     = closeAllPopoverFn;

        // get payment data;
        vm.getPaymentData = getPaymentData;
        vm.sortPaymentFn  = sortPaymentFn;

        ////////////////
        (function () {
            if (vm.data.createdAt) {
                vm.data.customCreatedAt = moment(vm.data.createdAt).fromNow();
            }

            if (vm.data.cards && vm.data.cards.length) {
                let primaryCard      = _.findWhere(vm.data.cards, {isPrimary: true});
                let primaryCardIndex = _.findIndex(vm.data.cards, {isPrimary: true});
                if (primaryCardIndex > 0) {
                    vm.data.cards.splice(primaryCardIndex, 1);
                    vm.data.cards.unshift(primaryCard);
                }
            }

        })();

        // Customer view KYC & Password tab
        function changePasswordFn(newPassword) {
            var obj = {
                "id"         : vm.data.id,
                "newPassword": newPassword
            };

            UserService
                .resetPassword(obj)
                .then(
                    (res) => {
                        var res = res.data;

                        if (res.code === "OK" && res.data) {
                            $scope.setFlash("s", res.message);
                        }
                        else {
                            $scope.setFlash("e", res.message);
                        }

                        $("#password-strength-label").text("");
                        $("#password-strength-label").removeClass("p15 btn-rounded");
                        $(".strength-meter-fill").removeAttr("data-strength");

                        vm.passForm = {"showPassword": false};
                    },
                    (err) => {
                        $("#password-strength-label").text("");
                        $("#password-strength-label").removeClass("p15 btn-rounded");
                        $(".strength-meter-fill").removeAttr("data-strength");

                        vm.passForm = {"showPassword": false};
                        $scope.flashHttpErrorFn(err);
                    });
        }

        // get complaint dispute function
        function getComplaintDisputeFn() {
            let obj = {
                page  : vm.complaintPage,
                limit : 10,
                userId: vm.data.id
            };
            CommonCrudService
                .paginate("job-complaint-dispute", obj)
                .then(
                    (res) => {
                        if (res.data) {
                            if (res.data.list && res.data.list.length) {
                                if (obj.page === 1) {
                                    vm.complaintDisputeList = angular.copy(res.data.list);
                                    _.each(vm.complaintDisputeList, function (stObj) {
                                        let statusObj = _.findWhere(JobComplaintDisputeStatus, {id: stObj.status});
                                        if (statusObj) {
                                            stObj['displayStatus'] = statusObj;
                                        }
                                    });
                                    vm.disabled = false;
                                }
                                else {
                                    vm.complaintDisputeList = vm.complaintDisputeList.concat(res.data.list);
                                    _.each(vm.complaintDisputeList, function (stObj) {
                                        if (stObj && stObj.status && !stObj.displayStatus) {
                                            let statusObj = _.findWhere(JobComplaintDisputeStatus, {id: stObj.status});
                                            if (statusObj) {
                                                stObj['displayStatus'] = statusObj;
                                            }
                                        }

                                    });
                                    vm.disabled = false;
                                }
                            }
                            else {
                                vm.disabled = true;
                            }


                        }
                        else {
                            vm.complaintDisputeList = [];
                            vm.disabled             = true;
                        }

                    },
                    (err) => {
                        vm.complaintDisputeList = [];
                        vm.disabled             = true;
                    }
                );
        }
        vm.getComplaintDisputeFn();

        function viewMoreComplaintFn() {
            vm.complaintPage = vm.complaintPage + 1;
            getComplaintDisputeFn();
        }

        function closeAllPopoverFn() {
            _.each(vm.complaintDisputeList, function (data) {
                data.isStatusTrackOpen = false;
            })
        }

        // payment data ..

        function getPaymentData() {
            let obj           = {};
            vm.paymentList    = [];
            vm.show_loading   = true;
            obj.paymentStatus = 'ALL';

            if (vm.data && vm.data.id && vm.data.id !== null) {
                if (!obj.filter) {
                    obj.filter = {};
                }
                obj.filter.transactionBy = vm.data.id
            }
            else {
                if (obj.filter && obj.filter.transactionBy) {
                    delete obj.filter.transactionBy;
                }
            }

            CommonCrudService
                .paginate('transaction-logs', obj)
                .then(function (res) {
                    if (res.code === "OK") {
                        vm.show_loading = false;
                        vm.paymentList  = res.data.list;

                        _.each(vm.paymentList, function (payment) {
                            let statusObj          = _.findWhere(stripStatus, {id: payment.status});
                            if (statusObj) {
                                payment['displayStatus'] = statusObj;
                            }
                        });


                        let creditAmountList = _.where(vm.paymentList, {type: 1});
                        let creditAmounts    = _.pluck(creditAmountList, 'amount');
                        let creditAmount     = _.reduce(creditAmounts, function (amount, num) {
                            return amount + num;
                        }, 0);

                        let debitAmountList = _.where(vm.paymentList, {type: 2});
                        let debitAmounts    = _.pluck(debitAmountList, 'amount');
                        let debitAmount     = _.reduce(debitAmounts, function (amount, num) {
                            return amount + num;
                        }, 0);


                        vm.totalAmount = (creditAmount - debitAmount).toFixed(2);

                    }
                    else {
                        vm.paymentList = [];
                    }
                });
        }
        getPaymentData();

        // Sort contents
        function sortPaymentFn(key, type, all = false) {
            vm.paymentList = _.sortBy(vm.paymentList, function (i) {
                return i[key];
            });

            if (all) {
                type = (type && type == 1) ? -1 : 1;
            }

            vm.sortBy      = {};
            vm.sortBy[key] = type;
            vm.sortBy.type = type;

            if (type == -1) {
                vm.paymentList.reverse();
            }
        }



        // Clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });

    }

})();