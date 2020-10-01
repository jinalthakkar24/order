(function () {
    'use strict';
    angular
        .module('app')
        .controller('MultipleFileUploadController', MultipleFileUploadController)
        .service('ImageUploadService', ImageUploadService)
        .component('fileUploadMultiple', {
            bindings  : {
                'layoutType' : '<',
                'height'     : '<',
                'width'      : '<',
                'accept'     : '<',
                'folder'     : '<',
                'file'       : '=',
                'titleName'  : '<',
                'remove'     : '=',
                'subtitle'   : '<',
                'displayFn'  : '&',
                'uploadRoute': '<',
                'softDelete' : '<',
                'id'         : '<',
                'isSortable' : '<'
            },
            scope     : true,
            template  : '<div ng-include="vm.getTemplate()">',
            controller: 'MultipleFileUploadController as vm'
        });

    /* @ngInject */
    function MultipleFileUploadController($scope, $element, Notification, $q, $http, ImageUploadService) {

        var vm = this;
        //console.log($element.find('.fileUpload'));
        //data
        vm.fileTypesExtensions  = {
            file : ['doc', 'docx', 'log', 'msg', 'odt', 'tex', 'wps', 'wpd', 'zip', '7z', 'zipx', 'cbr', 'deb', 'gz', 'pkg', 'rar', 'rpm', 'sitx', 'gz', 'tar', 'txt', 'rtf', 'ppt', 'pptx', 'pdf', 'xls', 'xlsx', 'xlr'],
            audio: ['aif', 'iff', 'm3u', 'm4a', 'mid', 'mpa', 'wma', 'mp3', 'ogg', 'wav', 'nvf'],
            word : ['doc', 'docx', 'log', 'msg', 'odt', 'tex', 'wps', 'wpd'],
            video: ['asf', 'flv', 'rm', 'srt', 'swf', 'vob', 'mp4', 'm4v', 'mov', 'wmv', 'mpg', 'ogv', '3gp', 'avi', '3g2'],
            zip  : ['zip', '7z', 'zipx', 'cbr', 'deb', 'gz', 'pkg', 'rar', 'rpm', 'sitx', 'gz', 'tar'],
            image: ['tif', 'raw', 'tiff', 'jpg', 'jpeg', 'png', 'gif', 'bmp'],
            excel: ['xls', 'xlsx', 'xlr'],
            pdf  : ['pdf'],
            ppt  : ['ppt', 'pptx'],
            text : ['txt', 'rtf']
        };
        var extensions          = [];
        //methods
        vm.$onInit              = initialize;
        vm.fileUploadFn         = fileUploadFn;
        vm.removeUploadedFileFn = removeUploadedFileFn;
        vm.getTemplate          = getTemplate;
        vm.displayImageFn       = displayImageFn;


        vm.dragControlListeners = {
            containment: '#horizontal-container',
            accept         : function (sourceItemHandleScope, destSortableScope) {
                return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
                //return true;
            },
            itemMoved      : function (event) {
                var obj = event.dest.sortableScope.modelValue;
            },
            orderChanged   : function (event) {
                vm.sortedAttachments = [];

                var dataArr = event.dest.sortableScope.modelValue;

                _.each(dataArr, function (destlist, index) {
                    if(_.isObject(destlist)){
                        destlist.sequence = index + 1;
                    }
                    vm.sortedAttachments.push(destlist);
                });

                vm.file = vm.sortedAttachments;
            },
            //containment: '#masterDiv',
            allowDuplicates: false


        };


        function displayImageFn(arr, ind) {
            var arrayImages = [];
            _.each(vm.file, function (file) {
                if (_.isObject(file)) {
                    arrayImages.push({path: file.imagePath, type: 1});
                }
                else {
                    arrayImages.push({path: file, type: 1});
                }

            })
            vm.displayFn({array: arrayImages, ind: ind})
        }


        //////////////
        function initialize() {
            console.log("File", vm.file);
            //file type for - image or file uploading
            if (vm.accept.indexOf('all') == -1) {
                _.each(vm.accept, function (fileType) {
                    extensions.push(vm.fileTypesExtensions[fileType])
                });
                extensions = _.flatten(extensions);
            }
            else {
                extensions.push('all');
            }

            vm.showSubTitle = vm.titleName ? vm.titleName.toLowerCase().indexOf('image') : 0;
            //on form reset remove image
            $scope.$watch('vm.remove', function (value) {
                if (value) {
                    removeUploadedFileFn(vm.file, true);
                }
            });
        }

        /**
         * Upload file to server
         * @param {Object} ele
         */
        function fileUploadFn(ele) {
            vm.uploadLoader = true;
            var upload      = function () {
                let url = "/upload-file";
                if (vm.uploadRoute) {
                    url = vm.uploadRoute;
                }
                $http.post(url, fd, {
                    transformRequest: angular.identity,
                    headers         : {
                        "Content-Type": undefined
                    }
                })
                    .then(function (res) {
                        res = res.data;
                        $element.find('.fileUpload').val('');
                        if (res.code == "OK") {
                            if (res.data && res.data.files && res.data.files.length) {
                                var dataAbsolutePaths = [];
                                if (!vm.uploadRoute) {
                                    if (vm.file && vm.file.length) {
                                        dataAbsolutePaths        = angular.copy(vm.file);
                                        var newDataAbsolutePaths = _.pluck(res.data.files, 'absolutePath');
                                        dataAbsolutePaths        = dataAbsolutePaths.concat(newDataAbsolutePaths);


                                    }
                                    else {
                                        dataAbsolutePaths = _.pluck(res.data.files, 'absolutePath');
                                    }
                                }
                                else {
                                    if (vm.file && vm.file.length) {
                                        dataAbsolutePaths        = angular.copy(vm.file);
                                        var newDataAbsolutePaths = [];
                                        _.each(res.data.files, function (file) {
                                            newDataAbsolutePaths.push({
                                                imagePath: file.absolutePath,
                                                pdfPath  : file.pdfPath
                                            });
                                        });
                                        dataAbsolutePaths = dataAbsolutePaths.concat(newDataAbsolutePaths);
                                    }
                                    else {
                                        _.each(res.data.files, function (file) {
                                            dataAbsolutePaths.push({
                                                imagePath: file.absolutePath,
                                                pdfPath  : file.pdfPath
                                            });
                                        });
                                    }

                                }
                            }

                            vm.file = angular.copy(dataAbsolutePaths);
                        }
                        else {
                            $element.find('.fileUpload').val('');
                        }
                        vm.uploadLoader = false;
                        Notification.success({'message': res.message})
                    });
            };
            if (ele.files[0]) {
                var i     = 0;
                var fd    = new FormData();
                // Check for the uploaded file is image or not
                var error = false;
                _.each(ele.files, function (file) {
                    var file_name = file.name;
                    var ext       = file_name.split('.').pop();

                    if (_.indexOf(extensions, ext.toLowerCase()) < 0) {
                        error = true;

                    }
                });

                if (!error) {
                    fd.append('destination', vm.folder);
                    _.each(ele.files, function (file) {
                        var img_file = file;
                        fd.append('file', img_file);
                        i++;
                    });
                    $q.all(fd).then(upload);
                }
                else {
                    vm.uploadLoader = false;
                    $element.find('.fileUpload').val('');
                    Notification.error({
                        'message': 'Please select ' + vm.accept.join(', ') + ' file only.'
                    });
                }
            }
        }

        /**
         * Remove uploaded file
         * @param {String} path
         * @param {Boolean} isTemporary
         */
        function removeUploadedFileFn(path, isTemporary) {
            if (isTemporary && vm.softDelete && vm.id && vm.uploadRoute) {
                let index = _.findIndex(vm.file, {imagePath: path});
                if (index > -1) {
                    vm.file[index].isDeleted = true;
                }

            }
            else {
                ImageUploadService
                    .removeFile({
                        paths: [path]
                    })
                    .then(function (res) {
                        res = res.data;
                        if (res.code == "OK") {
                            if (isTemporary) {
                                $element.find('.fileUpload').val('');
                            }
                            else {
                                if (!vm.uploadRoute) {
                                    let index = _.indexOf(vm.file, path);
                                    if (index > -1) {
                                        vm.file.splice(index, 1)
                                    }
                                }
                                else {
                                    let index = _.findIndex(vm.file, {imagePath: path});
                                    if (index > -1) {
                                        vm.file.splice(index, 1)
                                    }
                                }
                                $element.find('.fileUpload1').val('');
                                Notification.success({'message': res.message});
                            }
                        }
                        else {
                            Notification.error({'message': res.message});
                        }
                    });
            }


        }

        /**
         * Select Template dynamically based on layoutType attribute
         * @returns {string}
         */
        function getTemplate() {
            return '/app/admin/components/multiple-file-upload/templates/' + vm.layoutType + '-layout.html'
        }

        //clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });

    }

    /* @ngInject */
    function ImageUploadService($http) {
        return {
            uploadFile: function (file) {
                return $http.post('/upload-file', file, {
                    transformRequest: angular.identity,
                    headers         : {
                        'Content-Type': undefined
                    }
                })
            },
            removeFile: function (obj) {
                return $http.post('/delete-file', obj);
            }
        }
    }
})();