(function () {
    'use strict';

    angular.module('Users')
        .controller('CleanerViewController', CleanerViewController);

    /* @ngInject */
    function CleanerViewController
    ($scope, $rootScope, $state, USER_DOCUMENTS, CleanerType, CleanerService, UploadDocumentStatus, UserService, CommonCrudService, JobComplaintDisputeStatus, MasterService, JobRequestStatuses) {
        var vm                  = this;
        vm.userId               = $state.params.userId;
        vm.userStatus           = $state.params.userStatus;
        vm.cleanerType          = CleanerType;
        vm.UploadDocumentStatus = UploadDocumentStatus;
        vm.uploadDocumentAction = {
            APPROVED: true,
            REJECTED: false
        };

        vm.item              = {};
        vm.selectedDocuments = [];

        if (vm.userStatus === CleanerType.APPROVED) {
            vm.activeTab = 1;
        }
        else {
            vm.activeTab = 4;
        }

        vm.complaintPage             = 1;
        vm.reviewPage                = 1;
        vm.ratingRange               = (_.range(1, 6)).reverse();
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


        vm.uploadDocumentCategory = USER_DOCUMENTS.CATEGORIES;
        vm.uploadDocumentTypes    = USER_DOCUMENTS.TYPES;

        // method
        vm.getDocumentCategoryNameFn = getDocumentCategoryNameFn;
        vm.getDocumentTypeNameFn     = getDocumentTypeNameFn;
        vm.openDocumentViewModelFn   = openDocumentViewModelFn;
        vm.goToBackPage              = goToBackPage;
        vm.goToListPage              = goToListPage;
        vm.checkDocumentFn           = checkDocumentFn;
        vm.approveDocuments          = approveDocuments;
        vm.changePasswordFn          = changePasswordFn;
        vm.getComplaintDisputeFn     = getComplaintDisputeFn;
        vm.viewMoreComplaintFn       = viewMoreComplaintFn;

        vm.getRatingTypeMasterFn = getRatingTypeMasterFn;
        vm.getReviewFn           = getReviewFn;
        vm.viewMoreReviewFn      = viewMoreReviewFn;
        vm.getRatingParamsName   = getRatingParamsName;
        vm.closeAllPopoverFn     = closeAllPopoverFn;


        let windowHeight = $(window).innerHeight();
        vm.height        = (windowHeight - 150) + 'px';


        /////////
        (function () {

            if (vm.userId) {
                if (vm.userStatus !== CleanerType.APPROVED) {
                    CleanerService
                        .pendingRejectedCleanerView(vm.userId)
                        .then((res) => {
                            res = res.data;
                            if (res.code === 'OK') {
                                vm.item = res.data;

                                if (vm.item.uploadedDocuments && vm.item.uploadedDocuments.length) {
                                    formatUploadedDocuments();
                                }

                            }
                            else {
                                //$state.go("apps.adminSetup.user.list");
                                $scope.setFlash('e', res.message);
                            }
                        });
                }
                else {
                    CleanerService
                        .approvedCleanerView(vm.userId)
                        .then((res) => {
                            res = res.data;
                            if (res.code === 'OK') {
                                vm.item = res.data;
                                if (vm.item.statusWiseCounts && vm.item.statusWiseCounts.length) {
                                    let completedJob     = _.findWhere(vm.item.statusWiseCounts, {"_id": vm.jobStatus.COMPLETED});
                                    vm.totalCompletedJob = completedJob && completedJob.count ? completedJob.count : 0;

                                    let cancelJob        = _.findWhere(vm.item.statusWiseCounts, {"_id": vm.jobStatus.CANCELED});
                                    vm.totalCancelledJob = cancelJob && cancelJob.count ? cancelJob.count : 0;
                                    let totalJob         = 0;
                                    _.each(vm.item.statusWiseCounts, function (statusCount) {
                                        if (statusCount && statusCount.count) {
                                            totalJob += statusCount.count;
                                        }
                                    });
                                    vm.totalJob = totalJob;
                                }

                                if (vm.item.uploadedDocuments && vm.item.uploadedDocuments.length) {
                                    formatUploadedDocuments();
                                }
                            }
                            else {
                                $scope.setFlash('e', res.message);
                            }
                        });
                }
            }
            getRatingTypeMasterFn();
        })();

        function formatUploadedDocuments() {
            vm.uploadedDocuments = vm.item.uploadedDocuments.length;
            _.each(vm.item.uploadedDocuments, function (document) {
                if (document && document.path) {
                    let paths = [];
                    _.each(document.path, function (path) {
                        let pathObj   = {
                            path: path
                        };
                        //Find extension : For differentiate files like which is pdf/zip/ppt/word etx.
                        let filePath  = angular.copy(path);
                        let typeFile  = filePath.split('.');
                        let exten     = _.last(typeFile);
                        let extension = exten.toLowerCase();

                        if (_.contains($scope.fileTypeExtensions.IMAGE, extension)) {
                            pathObj.attachFileType = 'image';
                        }
                        else if (_.contains($scope.fileTypeExtensions.PDF, extension)) {
                            pathObj.attachFileType = 'pdf';
                        }
                        else if (_.contains($scope.fileTypeExtensions.EXCEL, extension)) {
                            pathObj.attachFileType = 'excel';
                        }
                        else if (_.contains($scope.fileTypeExtensions.TEXT, extension)) {
                            pathObj.attachFileType = 'txt';
                        }
                        else if (_.contains($scope.fileTypeExtensions.WORD, extension)) {
                            pathObj.attachFileType = 'word';
                        }
                        else if (_.contains($scope.fileTypeExtensions.ZIP, extension)) {
                            pathObj.attachFileType = 'zip';
                        }
                        else {
                            pathObj.attachFileType = 'extra';
                        }
                        paths.push(pathObj)
                    });
                    document.paths = paths
                }
            });
            vm.item.uploadedDocuments = _.groupBy(vm.item.uploadedDocuments, 'category');
        }

        function getDocumentCategoryNameFn(category) {
            let foundName = _.findWhere(vm.uploadDocumentCategory, {code: category});
            if (foundName && foundName.label) {
                return foundName.label
            }
            else {
                return '';
            }
        }

        function getDocumentTypeNameFn(type) {
            let foundName = _.findWhere(vm.uploadDocumentTypes, {code: type});
            if (foundName && foundName.label) {
                return foundName.label
            }
            else {
                return '';
            }
        }

        function checkDocumentFn(data) {
            if (data.isChecked) {
                let isExists = _.findIndex(vm.selectedDocuments, {id: data.id});
                if (isExists < 0) {
                    vm.selectedDocuments.push(data)
                }

            }
            else {
                let isExists = _.findIndex(vm.selectedDocuments, {id: data.id});
                if (isExists >= 0) {
                    vm.selectedDocuments.splice(isExists, 1);
                }
            }

        }

        function approveDocuments(isModalOpen) {
            if (isModalOpen) {
                angular.element("#verifyDocumentModal").modal("show");
            }
            else {
                let obj        = {};
                obj.isVerified = JSON.parse(vm.verifyAction);
                obj.documents  = [];


                _.each(vm.selectedDocuments, function (document) {
                    obj.userId = document.userId;
                    obj.documents.push({id: document.id, category: document.category})
                });

                CleanerService
                    .approveDocument(obj)
                    .then((res) => {
                        res = res.data;
                        if (res.code === 'OK') {
                            vm.selectedDocuments = [];

                            vm.item.uploadedDocuments = res.data.documents;
                            vm.item.documentCriteria  = res.data.documentCriteria;
                            formatUploadedDocuments();

                            angular.element("#verifyDocumentModal").modal("hide");
                            $scope.setFlash('s', res.message);
                        }
                        else {
                            $scope.setFlash('e', res.message);
                        }
                    });
            }

        }

        /**
         * Reset Password for user
         */
        function changePasswordFn(newPassword) {
            var obj = {
                id         : vm.userId,
                newPassword: newPassword
            };

            UserService
                .resetPassword(obj)
                .then(function (res) {
                        var res = res.data;
                        if (res.data && res.code === "OK") {
                            vm.passForm.newPassword      = '';
                            vm.passForm.confirm_password = '';
                            $('#password-strength-label').text('');
                            $("#password-strength-label").removeClass("p15 btn-rounded");
                            $('.strength-meter-fill').removeAttr('data-strength');
                            $scope.setFlash('s', res.message);
                        }
                    },
                    function (err) {
                        if (err.data && err.data.message) {
                            $scope.setFlash('e', err.data.message);
                        }
                    })
        }


        // get complaint dispute function
        function getComplaintDisputeFn() {
            let obj = {
                page  : vm.complaintPage,
                limit : 10,
                userId: vm.userId
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

        function viewMoreComplaintFn() {
            vm.complaintPage = vm.complaintPage + 1;
            getComplaintDisputeFn();
        }

        function getRatingTypeMasterFn() {
            MasterService
                .getMaster({
                    masters: ['RATING_TYPE'],
                    include: ['subMasters']
                })
                .then(function (res) {
                    res = res.data;
                    if (res.code === 'OK') {
                        vm.ratingTypes = res.data.RATING_TYPE && res.data.RATING_TYPE.subMasters ? res.data.RATING_TYPE.subMasters : [];
                    }
                });
        }

        // get complaint dispute function
        function getReviewFn() {
            let obj = {
                page  : vm.reviewPage,
                limit : 10,
                userId: vm.userId
            };
            CommonCrudService
                .paginate("review", obj)
                .then(
                    (res) => {
                        if (res.data) {
                            if (res.data.list && res.data.list.length) {
                                if (obj.page === 1) {
                                    vm.reviews             = angular.copy(res.data.list);
                                    vm.totalJobReviewCount = res.data.count;

                                }
                                else {
                                    vm.reviews = vm.reviews.concat(res.data.list);

                                }
                            }

                        }
                        else {
                            vm.reviews = [];
                        }

                    },
                    (err) => {
                        vm.reviews = [];

                    }
                );
        }

        function viewMoreReviewFn() {
            vm.reviewPage = vm.reviewPage + 1;
            getReviewFn();
        }

        function getRatingParamsName(ratingType) {
            let foundName = _.findWhere(vm.ratingTypes, {id: ratingType})
            if (foundName && foundName.name) {
                return foundName.name
            }
            else {
                return '';
            }
        }

        function closeAllPopoverFn() {
            _.each(vm.complaintDisputeList, function (data) {
                data.isStatusTrackOpen = false;
            })
        }

        function goToBackPage() {
            window.history.back();
        }

        function goToListPage() {
            if (vm.userStatus === vm.cleanerType.APPROVED) {
                $state.go('apps.users.approvedCleaners')
            }
            else if (vm.userStatus === vm.cleanerType.PENDING_APPROVAL) {
                $state.go('apps.users.pendingApprovedCleaners')
            }
            else if (vm.userStatus === vm.cleanerType.REJECTED) {
                $state.go('apps.users.rejectedCleaners')
            }

        }

        function openDocumentViewModelFn(path) {
            vm.documentPath = path;
            $('#documentViewModal').modal('show')
        }
    }
})();