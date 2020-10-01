(function () {
    "use strict";
    angular
        .module("app")
        .controller("FileUploadController", FileUploadController)
        .service("ImageUploadService", ImageUploadService)
        .component("fileUpload", {
            bindings  : {
                "btnText"   : "<",
                "layoutType": "<",
                "height"    : "<",
                "width"     : "<",
                "accept"    : "<",
                "folder"    : "<",
                "file"      : "=",
                "titleName" : "<",
                "remove"    : "=",
                "subtitle"  : "<",
                "displayFn" : "&",
                "saved"     : "=",
                "isUpdate"  : "="
            },
            scope     : true,
            template  : "<div ng-include=\"vm.getTemplate()\">",
            controller: "FileUploadController as vm"
        });

    /* @ngInject */
    function FileUploadController($scope, $element, Notification, $q, ImageUploadService) {
        var vm = this;

        vm.fileTypesExtensions = {
            file : ["doc", "docx", "log", "msg", "odt", "tex", "wps", "wpd", "zip", "7z", "zipx", "cbr", "deb", "gz", "pkg", "rar", "rpm", "sitx", "gz", "tar", "txt", "rtf", "ppt", "pptx", "pdf", "xls", "xlsx", "xlr"],
            audio: ["aif", "iff", "m3u", "m4a", "mid", "mpa", "wma", "mp3", "ogg", "wav", "nvf"],
            word : ["doc", "docx", "log", "msg", "odt", "tex", "wps", "wpd"],
            video: ["asf", "flv", "rm", "srt", "swf", "vob", "mp4", "m4v", "mov", "wmv", "mpg", "ogv", "3gp", "avi", "3g2"],
            zip  : ["zip", "7z", "zipx", "cbr", "deb", "gz", "pkg", "rar", "rpm", "sitx", "gz", "tar"],
            image: ["tif", "raw", "tiff", "jpg", "jpeg", "png", "gif", "bmp"],
            excel: ["xls", "xlsx", "xlr"],
            pdf  : ["pdf"],
            ppt  : ["ppt", "pptx"],
            text : ["txt", "rtf"]
        };
        var extensions         = [];

        //methods
        vm.$onInit              = initialize;
        vm.fileUploadFn         = fileUploadFn;
        vm.removeUploadedFileFn = removeUploadedFileFn;
        vm.getTemplate          = getTemplate;

        //////////////
        function initialize() {
            //file type for - image or file uploading
            if (vm.accept.indexOf("all") == -1) {
                _.each(vm.accept, function (fileType) {
                    extensions.push(vm.fileTypesExtensions[fileType]);
                });
                extensions = _.flatten(extensions);
            }
            else {
                extensions.push("all");
            }

            // vm.showSubTitle = vm.titleName.toLowerCase().indexOf('image');
            //on form reset remove image
            $scope.$watch("vm.remove", function (value) {
                if (value) {
                    removeUploadedFileFn(vm.file, false);
                }
            });
            $scope.$watch("vm.saved", function (value) {
                if (value) {
                    if (vm.tmpFile && vm.tmpFile !== vm.file) {
                        removeUploadedFileFn(vm.tmpFile, true);
                    }
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
                ImageUploadService
                    .uploadFile(fd)
                    .then(function (res) {
                        res = res.data;
                        $element.find(".fileUpload").val("");
                        if (res.code == "OK") {
                            if (vm.file && vm.file) {
                                var oldfilePath = angular.copy(vm.file);
                                vm.removeUploadedFileFn(oldfilePath, true);
                            }
                            if (res.data && res.data.files && res.data.files.length) {
                                var uploadedFile = res.data.files[0];
                                if (uploadedFile && uploadedFile.absolutePath) {
                                    vm.file = uploadedFile.absolutePath;
                                }
                            }
                        }
                        else {
                            $element.find(".fileUpload").val("");
                        }
                        vm.uploadLoader = false;
                        Notification.success({"message": res.message});
                    });
            };
            if (ele.files[0]) {
                var fd        = new FormData();
                var img_file  = ele.files[0];
                vm.img_file   = img_file;
                var file_name = vm.img_file.name;
                if (file_name) {
                    var ext = file_name.split(".").pop();

                    if (_.indexOf(extensions, "all") !== -1 || _.indexOf(extensions, ext.toLowerCase()) >= 0) {
                        console.log(vm.folder, vm.img_file);
                        fd.append("destination", vm.folder);
                        fd.append("file", vm.img_file);
                        console.log(fd);
                        $q.all(fd).then(upload);
                    }
                    else {
                        vm.uploadLoader = false;
                        $element.find(".fileUpload").val("");
                        Notification.error({
                            "message": "Please select " + vm.accept.join(", ") + " file only."
                        });
                    }
                }
            }
        }

        /**
         * Remove uploaded file
         * @param {String} path
         * @param {Boolean} isTemporary
         */
        function removeUploadedFileFn(path, isTemporary) {
            if (vm.file && vm.isUpdate && !vm.tmpFile) {
                vm.tmpFile = path;
                vm.file    = "";
                return;
            }

            ImageUploadService
                .removeFile({
                    paths: [path]
                })
                .then(function (res) {
                    res = res.data;
                    if (res.code == "OK") {
                        if (isTemporary) {
                            $element.find(".fileUpload").val("");
                        }
                        else {
                            vm.file = "";
                            $element.find(".fileUpload").val("");
                            Notification.success({"message": res.message});
                        }
                        vm.remove = false;
                    }
                    else {
                        Notification.error({"message": res.message});
                    }
                });
        }

        /**
         * Select Template dynamically based on layoutType attribute
         * @returns {string}
         */
        function getTemplate() {
            return "/app/admin/components/file-upload/templates/" + vm.layoutType + "-layout.html";
        }

        // Clear vm
        $scope.$on("$destroy", function () {
            vm = [];
        });

    }

    /* @ngInject */
    function ImageUploadService($http) {
        return {
            uploadFile: function (file) {
                return $http.post("/upload-file", file, {
                    transformRequest: angular.identity,
                    headers         : {
                        "Content-Type": undefined
                    }
                });
            },
            removeFile: function (obj) {
                return $http.post("/delete-file", obj);
            }
        };
    }
})();