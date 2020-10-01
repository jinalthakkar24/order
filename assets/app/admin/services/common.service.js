(function () {
    'use strict';

    angular.module('app')
        .service('CommonService', CommonService);

    /* @ngInject */
    function CommonService($http,$filter,FileTypes) {

        function camelize(str) {
            return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
                return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
            }).replace(/\s+/g, '');
        }

        function displayImages(array, ind) {
            //If list ma image columan vali image primary set thy hy e show thati hy to arguments ma only array aavse
            //Index ahi aapne find karisu; as below
            if (!ind && ind != 0) {
                //array mathi primary true hy evi image fiond krvani - ahi filter thi eno array malse
                // Filter nu Result : only one image no array malse
                var tempArray     = angular.copy(array);
                //$filter('filter')(array, expression, comparator, anyPropertyKey)
                var filterImageId = $filter("arrayPrimaryValue")(tempArray, "path");

                //Main array parthi aa filter vali image no index find thy jase
                var ind = _.findIndex(array, {path: filterImageId});
            }

            if (array && array.length) {
                var oldArray              = angular.copy(array);
                var selectedFile          = oldArray[ind];
                var newArrayOlyWithImages = _.where(oldArray, {type: FileTypes.ATTACHMENT_TYPE_IMAGE});
                var newArrayIndex         = _.findIndex(newArrayOlyWithImages, function (value) {
                    return value.path == selectedFile.path;
                });
                var imageArray            = [];

                _.each(newArrayOlyWithImages, function (img) {
                    var objSrc = {
                        src : img.path,
                        desc: img.description,
                        name: img.name
                    };
                    imageArray.push(objSrc);
                });

                $(".popup-gallery").magnificPopup({
                    items    : imageArray,
                    index    : newArrayIndex,
                    type     : "image",
                    tLoading : "Loading image #%curr%...",
                    mainClass: "mfp-img-mobile mfp-with-zoom",
                    gallery  : {
                        enabled           : true,
                        navigateByImgClick: true,
                        preload           : [0, 1] // Will preload 0 - before current, and 1 after the current image
                    },

                    image: {
                        tError  : "<a href=\"%url%\">The image #%curr%</a> could not be loaded.",
                        titleSrc: function (item) {
                            var name = "";
                            if (item && item.data && item.data.name) {
                                name += item.data.name;
                            }

                            if (item && item.data && item.data.desc) {
                                name += "<small>" + item.data.desc + "</small>";
                            }
                            //return item.el.attr('name') + '<small>'+item.el.attr('desc')+'</small>';
                            return name;
                        }
                    },
                    zoom : {
                        enabled: true, // By default it's false, so don't forget to enable it

                        duration: 300, // duration of the effect, in milliseconds
                        easing  : "ease-in-out", // CSS transition easing function
                        opener  : function (element) {
                            return element.img;
                        }
                        /*// The "opener" function should return the element from which popup will be zoomed in
                         // and to which popup will be scaled down
                         // By defailt it looks for an image tag:
                         opener: function(openerElement) {
                         // openerElement is the element on which popup was initialized, in this case its <a> tag
                         // you don't need to add "opener" option if this code matches your needs, it's defailt one.
                         return openerElement.is('img') ? openerElement : openerElement.find('img');

                         }*/
                    }
                });
            }
        }

        function getDisplayImageExtensionWiseFn(path, file) {
            const attachmentPath = "/images/common/attachments/";

            let type, no_exists = true;

            if (file && file.type) {
                switch (file.type) {
                    case FileTypes.ATTACHMENT_TYPE_IMAGE:
                        return $filter("fileUrlFilter")(path);
                        break;
                    case FileTypes.ATTACHMENT_TYPE_VIDEO:
                        return attachmentPath + "video.png";
                        break;
                    case FileTypes.ATTACHMENT_TYPE_AUDIO:
                        return attachmentPath + "audio.png";
                        break;
                    case FileTypes.ATTACHMENT_TYPE_DOCUMENT:
                        if (!file.fileType) {
                            let filePath  = angular.copy(file.path),
                                extension = filePath.split(".").pop().toLowerCase();

                            if (_.contains(FileTypeExtensions.IMAGE, extension)) {
                                type = FileTypes.ATTACHMENT_TYPE_IMAGE;
                            }
                            else if (_.contains(FileTypeExtensions.VIDEO, extension)) {
                                type = FileTypes.ATTACHMENT_TYPE_VIDEO;
                            }
                            else if (_.contains(FileTypeExtensions.FILE, extension)) {
                                type = FileTypes.ATTACHMENT_TYPE_DOCUMENT;
                                if (_.contains(FileTypeExtensions.PDF, extension)) {
                                    file.fileType = "pdf";
                                }
                                else if (_.contains(FileTypeExtensions.EXCEL, extension)) {
                                    file.fileType = "exl";
                                }
                                else if (_.contains(FileTypeExtensions.PPT, extension)) {
                                    file.fileType = "ppt";
                                }
                                else if (_.contains(FileTypeExtensions.TEXT, extension)) {
                                    file.fileType = "txt";
                                }
                                else if (_.contains(FileTypeExtensions.WORD, extension)) {
                                    file.fileType = "wrd";
                                }
                                else if (_.contains(FileTypeExtensions.ZIP, extension)) {
                                    file.fileType = "zip";
                                }
                                else {
                                    file.fileType = "extra";
                                }
                            }
                            else if (_.contains(FileTypeExtensions.AUDIO, extension)) {
                                type = FileTypes.ATTACHMENT_TYPE_AUDIO;
                            }
                        }
                        switch (file.fileType) {
                            case "pdf":
                                return attachmentPath + "pdf.png";
                                break;
                            case "exl":
                                return attachmentPath + "excel.png";
                                break;
                            case "ppt":
                                return attachmentPath + "ppt.png";
                                break;
                            case "txt":
                                return attachmentPath + "text.png";
                                break;
                            case "wrd":
                                return attachmentPath + "word.png";
                                break;
                            case "zip":
                                return attachmentPath + "zip.png";
                                break;
                            case "extra":
                                return attachmentPath + "file.png";
                                break;
                        }
                        break;
                }

                if (no_exists) {
                    return attachmentPath + "doc.jpg";
                }
            }
        }

        function getDragControlListnersObjectFn(MainList, callback, prop = null) {
            let defaults = {
                axis: "y",
                containment: "table",
                containerPositioning: "relative",
                allowDuplicates: false
            };

            if (prop && _.isObject(prop) && !_.isEmpty(prop)) {
                _.extend(defaults, prop);
            }

            let dragListnersObj = {
                accept: function (sourceItemHandleScope, destSortableScope) {
                    return sourceItemHandleScope.itemScope.sortableScope.$id == destSortableScope.$id;
                },
                orderChanged: function () {
                    let SortedSeq = [];
                    _.each(MainList, function (destlist, index) {
                        destlist.sequence = index + 1;
                        SortedSeq.push({"id": destlist.id, "sequence": index + 1});
                    });
                    callback(SortedSeq);
                }
            };

            _.extend(dragListnersObj, defaults);

            return dragListnersObj;
        }

        function commonEmailPhoneReqService(array, key, primaryInd) {
            var arr = [];
            _.each(array, function (item, ind) {
                if (item[key]) {
                    var obj = {};
                    if (key == "mobile") {
                        var interNationalFormat = $("#cell" + ind).intlTelInput("getNumber", intlTelInputUtils.numberFormat.INTERNATIONAL);
                        obj["fullMobile"] = angular.copy(interNationalFormat);
                        var nationalFormat = $('#cell' + ind).intlTelInput('getNumber', intlTelInputUtils.numberFormat.NATIONAL);
                        obj["mobile"] = angular.copy(nationalFormat);
                        var countryData = $("#cell" + ind).intlTelInput('getSelectedCountryData');
                        if (countryData) {
                            obj["countryCode"] = '+' + countryData.dialCode;
                        }
                    }
                    else {
                        obj[key] = item[key];
                    }
                    if (primaryInd == ind)
                        obj.isPrimary = true;
                    arr.push(obj);
                }
            });
            return arr;
        }

        return {
            navMenu: function () {
                return $http.get('/data/navbar.json');
            },
            codeConver: function (string) {
                var removedCharString = string.replace(/[^a-zA-Z0-9\s]/g, '');
                removedCharString = removedCharString.trim();
                return removedCharString.replace(/\s+/g, '_').toUpperCase();
            },
            camelize: camelize,
            csvToArray: function (csvString) {
                var lines = csvString.split('\n');
                var headerValues = lines[0].split(',');
                var dataValues = lines.splice(1).map(function (dataLine) {
                    return dataLine.split(',');
                });
                return dataValues.map(function (rowValues) {
                    var row = {};
                    headerValues.forEach(function (headerValue, index) {
                        row[camelize(headerValue)] = (index < rowValues.length) ? rowValues[index] : null;
                    });
                    return row;
                });
            },
            displayImages                 : displayImages,
            getDisplayImageExtensionWiseFn: getDisplayImageExtensionWiseFn,
            getDragControlListnersObjectFn: getDragControlListnersObjectFn,
            commonEmailPhoneReqService: commonEmailPhoneReqService
        }
    }
})();