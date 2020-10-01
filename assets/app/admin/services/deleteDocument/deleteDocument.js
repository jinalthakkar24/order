(function () {
    'use strict';
    angular
        .module('app')
        .service('DeleteDocumentService', DeleteDocumentService)
        .controller('ForeignCollectionCountModalCtrl', ForeignCollectionCountModalCtrl)
        .controller('ConfirmDeleteModalCtrl', ConfirmDeleteModalCtrl);

    /* @ngInject */
    function ConfirmDeleteModalCtrl(DeleteDocumentService, $uibModalInstance, Options) {
        var vm = this;
        //methods
        if (Options.noDelete) {
            vm.deleteDocument = DeleteDocumentService.softDeleteRecord;
        }
        else {
            vm.deleteDocument = DeleteDocumentService.deleteDocument;
        }
        vm.options    = Options;
        vm.closeModal = closeModal;

        ///////////

        function closeModal() {
            $uibModalInstance.dismiss('cancel');
        }
    }

    /* @ngInject */
    function ForeignCollectionCountModalCtrl(Records, Options, $scope, $uibModalInstance, DeleteDocumentService) {
        var vm              = this;
        //data
        vm.options          = Options;
        //methods
        vm.softDeleteRecord = DeleteDocumentService.softDeleteRecord;
        vm.deleteDocument   = DeleteDocumentService.deleteDocument;

        vm.close                  = DeleteDocumentService.closeModal;
        vm.getDependencies        = getDependencies;
        vm.showConfirmDeleteModal = showConfirmDeleteModal;
        vm.closeModal             = closeModal;
        //////

        (function () {
            vm.models = Records;
        })();

        function showConfirmDeleteModal() {
            DeleteDocumentService.confirmDeleteModal(null, Options, Options.paginateDetails, Options.callback, Options.list, Options.isNoPageRefresh)
        }

        function closeModal() {
            $uibModalInstance.dismiss('cancel');
        }

        function getDependencies(data, documentId) {
            if (!data.showing) {
                return;
            }
            DeleteDocumentService
                .getDependencies({
                    documentId    : documentId,
                    model         : Options.model,
                    dependentModel: data.model,
                    idsArr        : data.idsArr
                })
                .then(function (res) {
                    res = res.data;
                    if (res.code === 'OK') {
                        data.dependentRecords = res.data;
                    }
                }, function (err) {
                    err = err.data;
                    Notification.error({'message': err.message});
                });
        }

        $scope.$on('$destroy', function () {
            vm = []
        });
    }

    /* @ngInject */
    function DeleteDocumentService($http, Notification, $uibModal) {
        var modalInstance        = '';
        var confirmModalInstance = '';
        var service              = {
            getDependencies   : function (obj) {
                return $http.post('/admin/common/foreign-dependencies-records', obj)
            },
            deleteDocument    : deleteDocument,
            softDeleteRecord  : softDeleteRecord,
            openModal         : openModal,
            closeModal        : closeModal,
            confirmDeleteModal: confirmDeleteModal,
            closeConfirmModal : closeConfirmModal
        };

        function confirmDeleteModal(data, options, paginateDetails, callback, list, isNoPageRefresh) {
            confirmModalInstance = $uibModal.open({
                ariaLabelledBy : 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl    : '/app/admin/services/deleteDocument/confirmDelete.html',
                controller     : 'ConfirmDeleteModalCtrl',
                controllerAs   : 'vm',
                size           : 'md',
                appendTo       : angular.element('body'),
                resolve        : {
                    Options: function () {
                        options.callback        = callback;
                        options.paginateDetails = paginateDetails;
                        options.list            = list;
                        options.isNoPageRefresh = isNoPageRefresh;
                        return options
                    }
                }
            });

            confirmModalInstance.result.then(function (result) {
                // use promise.resolve(result) from .close()
            }, function () {

            });
        }

        function closeConfirmModal() {
            if (confirmModalInstance) {
                confirmModalInstance.dismiss('cancel');
            }
        }

        function openModal(options, paginateDetails, callback, list, isNoPageRefresh) {
            var req_obj = {
                method: 'post',
                url   : '/admin/common/foreign-dependencies-count',
                data  : {documentId: options.documentId, model: options.model}
            };

            $http(req_obj)
                .then(function (res) {
                    res = res.data;
                    if (res.code === 'OK') {
                        res = res.data;
                        if (res.list && _.size(res.list) > 0) {
                            var dependentsExists = false;
                            _.each(res.list, function (list) {
                                if (list.dependents && _.size(list.dependents) > 0) {
                                    dependentsExists = true;
                                }
                            });
                            if (!dependentsExists) {
                                //remove document from collection
                                service.confirmDeleteModal(res.list, options, paginateDetails, callback, list, isNoPageRefresh)
                            }
                            else {
                                _openModal(res.list, options, paginateDetails, callback, list, isNoPageRefresh);
                            }
                        }
                        else {
                            //remove document from collection
                            service.confirmDeleteModal(res.list, options, paginateDetails, callback, list, isNoPageRefresh)
                        }
                    }
                }, function (err) {
                    err = err.data;
                    Notification.error({'message': err.message});
                });

        }

        function _openModal(data, options, paginateDetails, callback, list, isNoPageRefresh) {
            modalInstance = $uibModal.open({
                ariaLabelledBy : 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl    : '/app/admin/services/deleteDocument/deleteDocumentModal.html',
                controller     : 'ForeignCollectionCountModalCtrl',
                controllerAs   : 'vm',
                size           : 'md',
                appendTo       : angular.element('body'),
                resolve        : {
                    Records: function () {
                        return data
                    },
                    Options: function () {
                        options.callback        = callback;
                        options.paginateDetails = paginateDetails;
                        options.list            = list;
                        options.isNoPageRefresh = isNoPageRefresh;
                        return options
                    }
                }
            });

            modalInstance.result.then(function (selectedItem) {
            }, function () {
            });
        }

        function closeModal() {
            if (modalInstance) {
                modalInstance.dismiss('cancel');
            }
        }

        /**
         * Delete Document
         * @private
         */
        function deleteDocument(model, documentId, paginateDetails, callback, list, isNoPageRefresh) {
            if (!_.isArray(documentId)) {
                documentId = [documentId];
            }
            var req_obj = {
                method: 'post',
                url   : '/admin/common/bulk-destroy',
                data  : {
                    ids  : documentId,
                    model: model
                }
            };
            $http(req_obj)
                .then(function (res) {
                    res = res.data;
                    if (res.code === 'OK') {
                        Notification.success({'message': res.message, replaceMessage: true});
                        service.closeModal();
                        service.closeConfirmModal();
                        if (isNoPageRefresh && list) {
                            _.each(res.data, function (id) {
                                let findIndex = _.findIndex(list, {id: id});
                                if (findIndex >= 0) {
                                    list.splice(findIndex, 1)
                                }
                            });
                            return list;
                        }
                        else {
                            if (paginateDetails.listCount === 1) {
                                callback(paginateDetails.pageNo - 1);
                            }
                            else {
                                if (typeof documentId === 'object') {
                                    if (paginateDetails.listCount === documentId.length) {
                                        callback(paginateDetails.pageNo - 1);
                                    }
                                }
                                callback();
                            }
                        }

                    }
                    else {
                        Notification.error({'message': res.message});
                    }
                }, function (err) {
                    err = err.data;
                    Notification.error({'message': err.message});
                });
        }

        /**
         * soft delete record
         */
        function softDeleteRecord(model, documentId, paginateDetails, callback, list, isNoPageRefresh) {

            var req_obj = {
                method: 'put',
                url   : '/admin/common/soft-delete-record',
                data  : {
                    ids  : documentId,
                    model: model
                }
            };
            $http(req_obj)
                .then(function (res) {
                    res = res.data;
                    if (res.code === 'OK') {
                        Notification.success({'message': res.message, replaceMessage: true});
                        if (isNoPageRefresh && list) {
                            _.each(res.data, function (id) {
                                let findIndex = _.findIndex(list, {id: id});
                                if (findIndex >= 0) {
                                    list.splice(findIndex, 1)
                                }
                            });
                            return list;
                        }
                        else {
                            if (paginateDetails.listCount === 1) {
                                callback(paginateDetails.pageNo - 1);
                            }
                            else {
                                if (typeof documentId === 'object') {
                                    if (paginateDetails.listCount === documentId.length) {
                                        callback(paginateDetails.pageNo - 1);
                                    }
                                }
                                callback();
                            }
                            callback();
                        }

                        service.closeModal();

                    }
                    else {
                        Notification.error({'message': res.message, replaceMessage: true});
                    }
                }, function (err) {
                    err = err.data;
                    Notification.error({'message': err.message});
                });
        }


        return service;
    }
})();