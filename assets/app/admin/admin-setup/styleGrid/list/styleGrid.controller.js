/**  * Created by Hardik on 26/7/18.
 */

(function () {
    'use strict';
    angular
        .module('AdminSetup.StyleGrid') // to-do add module name and controller;
        .controller('StyleGridController', StyleGridController);

    /* @ngInject */
    function StyleGridController($scope, CommonService) {
        var vm  = this;
        vm.item = {};

        vm.today   = moment().toISOString();
        vm.tabType = {
            common: 1,
            header: 2,
            body  : 3,
            footer: 4
        };

        vm.buttons = [
            {id: 1, name: 'Male'},
            {id: 2, name: 'Female'},
            {id: 3, name: 'Other'}
        ];
        vm.gender  = '1';

        vm.uiSelectTypes  = [
            {id: 1, name: 'Default multi-select'},
            {id: 2, name: 'API call multi-select'}
        ];
        vm.uiSelectType   = '1';

        vm.datPickerTypes = [
            {id: 1, name: 'Only Date Picker'},
            {id: 2, name: 'Start - End date Picker'}
        ];
        vm.datPickerType  = '1';

        vm.descTypes = [
            {id: 1, name: 'Full content for detail view'},
            {id: 2, name: 'Truncate upto 225 letters for list view'},
            {id: 3, name: 'Full content for list detail view'}
        ];
        vm.descType  = '1';

        vm.dynamicTooltipText = 'This is dynamic tooltip !';

        vm.commonList = [
            {id: 'topCommon', name: 'All'},

            {id: 'action-btn-id', name: 'Action Buttons'},
            {id: 'excel-dd', name: 'Excel Import/Export Dropdown'},
            {id: 'content-loader', name: 'Content Loader'},
            {id: 'url-binder', name: 'URL Binder'},
            {id: 'copy-btn', name: 'Copy to Clipboard Button'},
            {id: 'file-upload-id', name: 'File Upload'},
            {id: 'pagination-id', name: 'Pagination'},
            {id: 'layout-id', name: 'App Layouts', isMerge: true},
            {id: 'list-layout', name: 'List'},
            {id: 'view-layout', name: 'View'},
            {id: 'form-table-layout', name: 'Form with Table Layout'}
        ];

        vm.headerList = [
            {id: 'top', name: 'All'},

            {id: 'left-side-id', name: 'Left side Div', isMerge: true},
            {id: 'total-id', name: 'Total count (badge)'},
            {id: 'refresh-id', name: 'Refresh Button'},
            {id: 'full-left-id', name: 'Full Left Side Div '},

            {id: 'right-side-id', name: 'Right side Div', isMerge: true},
            {id: 'search-id', name: 'Search Button'},
            {id: 'filter-id', name: 'Filter Button'},
            {id: 'filter-btn-group-id', name: 'Filter with button group'},
            {id: 'excel-id', name: 'Excel Button'},
            {id: 'multiple-btn-id', name: 'Multiple Action Button'},
            {id: 'full-right-id', name: 'Full Right Side Div'},

            {id: 'full-hdr-id', name: 'Full Header div', isMerge: true}
        ];

        vm.bodyList = [
            {id: 'topBody', name: 'All'},
            {id: 'button-id', name: 'Button'},
            {id: 'tooltip-id', name: 'Tooltip'},
            {id: 'popover-id', name: 'Popover'},
            {id: 'ui-select-id', name: 'Ui-select', isMerge: true},
            {id: 'single-select-id', name: 'Single Selection'},
            {id: 'multi-select-id', name: 'Multiple Selection'},
            {id: 'display-id', name: 'Display element', isMerge: true},
            {id: 'list-id', name: 'Listing'},
            {id: 'desc-id', name: 'Description Block'},
            {id: 'link-id', name: 'Link'},
            {id: 'date-id', name: 'Date format'},
            {id: 'image-id', name: 'Image'},
            {id: 'input-id', name: 'Input element', isMerge: true},
            {id: 'cell-id', name: 'Cell number'},
            {id: 'date-picker-id', name: 'Date picker'},
            {id: 'date-range-id', name: 'Date range picker'},
            {id: 'date-time-picker-id', name: 'Date time picker'}

        ];

        vm.footerList = [
            {id: 1, name: 'All'}
        ];

        vm.listLayoutTypes = [
            {id: 1, name: 'Basic'},
            {id: 2, name: 'Table'},
            {id: 3, name: 'Block'}
        ];
        vm.listLayoutType  = '1';

        vm.listLayoutArr = [
            // Basic Layout
            {
                id          : 1,
                instructions: "This layout contains header, content & footer portion partially.",
                content     : '<!--Basic Layout-->\n' +
                    '<div class="hbox hbox-auto-xs bg-light " ng-init="\n' +
                    '  app.settings.asideFixed = true;\n' +
                    '  app.settings.asideDock = false;\n' +
                    '  app.settings.container = false;\n' +
                    '  app.hideAside = false;\n' +
                    '  app.hideFooter = true;\n' +
                    '  ">\n' +
                    '    <div class="col">\n' +
                    '        <div class="vbox">\n' +
                    '            <!--Header-->\n' +
                    '            <div class="wrapper-sm bg-gray clearfix b-b">\n' +
                    '                <!--Module Name-->\n' +
                    '                <div class="h4 m-t-xs pull-left">\n' +
                    '                    {{ vm.moduleData.title }}\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '\n' +
                    '            <!--Contents-->\n' +
                    '            <div class="row-row">\n' +
                    '                <div class="cell">\n' +
                    '                    <div class="cell-inner">\n' +
                    '\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '\n' +
                    '            <!--Footer-->\n' +
                    '            <div class="wrapper-xs padder b-t centered-pagination"\n' +
                    '                 ng-if="vm.items && vm.items.length">\n' +
                    '                <!--Paste footer code here-->\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '    <!--/col-->\n' +
                    '</div>'
            },

            // Table Layout
            {
                id          : 2,
                instructions: "This layout contains header with actions, static table header, content with scrollable table and partial footer.",
                content     : '<!--Popover Template-->\n' +
                    '<script type="text/ng-template" id="myFilterPopoverTemplate.html">\n' +
                    '    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padder">\n' +
                    '        <button class="btn btn-success btn-sm pull-right m-xs m-r-none"\n' +
                    '                ng-click="vm.filterApplyFn()">Apply\n' +
                    '        </button>\n' +
                    '\n' +
                    '        <button ng-click="vm.clearFilterFn()"\n' +
                    '                class="btn btn-info btn-sm pull-right m-xs m-r-none">Reset\n' +
                    '        </button>\n' +
                    '    </div>\n' +
                    '</script>\n' +
                    '\n' +
                    '<!--Table Layout-->\n' +
                    '<div class="hbox hbox-auto-xs bg-light " ng-init="\n' +
                    '  app.settings.asideFixed = true;\n' +
                    '  app.settings.asideDock = false;\n' +
                    '  app.settings.container = false;\n' +
                    '  app.hideAside = false;\n' +
                    '  app.hideFooter = true;\n' +
                    '  ">\n' +
                    '    <div class="col">\n' +
                    '        <div class="vbox">\n' +
                    '            <!--Header-->\n' +
                    '            <div class="wrapper-sm bg-gray clearfix b-b">\n' +
                    '                <!--Module Name-->\n' +
                    '                <div class="h4 m-t-xs pull-left">\n' +
                    '                    {{ vm.moduleData.title }}\n' +
                    '                    <b class="badge bg-dark text-white">{{ vm.totalCount }}</b>\n' +
                    '\n' +
                    '                    <!--Reload Btn-->\n' +
                    '                    <button class="btn btn-sm btn-rounded p08"\n' +
                    '                            ng-class="vm.refreshLoader ? \'btn-info\' : \'btn-default b-info\'"\n' +
                    '                            ng-click="vm.refreshFn();">\n' +
                    '                        <i class="fa fa-refresh"\n' +
                    '                           ng-class="vm.refreshLoader ? \'fa-spin text-white\' : \'text-info\'"></i>\n' +
                    '                    </button>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Add-->\n' +
                    '                <button type="button"\n' +
                    '                        class="btn btn-sm btn-add pull-right"\n' +
                    '                        has-permission="{{insertPermission}}"\n' +
                    '                        has-module="{{moduleConference}}"\n' +
                    '                        ui-sref="apps.adminSetup.conference.upsert">\n' +
                    '                    Add\n' +
                    '                </button>\n' +
                    '\n' +
                    '                <!--Search box-->\n' +
                    '                <div class="pull-right m-r-xs">\n' +
                    '                    <div class="input-group">\n' +
                    '                        <input type="text"\n' +
                    '                               class="fontAwesome form-control h30"\n' +
                    '                               ng-model="vm.search"\n' +
                    '                               my-enter="vm.searchFn()"\n' +
                    '                               focus-me="vm.searchFocus"\n' +
                    '                               placeholder="Title / Identifier" />\n' +
                    '                        <span ng-if="vm.search && vm.searchApplied" ng-click="vm.resetSearchFn()" class="cad">\n' +
                    '            <i class="fa fa-times text-danger"></i>\n' +
                    '        </span>\n' +
                    '                        <div class="input-group-btn">\n' +
                    '                            <button type="button" class="btn btn-sm"\n' +
                    '                                    ng-class="vm.searchApplied ? \'btn-info\' : \'btn-default\'"\n' +
                    '                                    ng-click="vm.searchFn()">\n' +
                    '                                <i ng-class="vm.searchLoader ? \'fa-spinner fa-spin\' : \'fa-search\'" class="fa"></i>\n' +
                    '                            </button>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Filter - popover-->\n' +
                    '                <div class="btn-group pull-right m-r-xs">\n' +
                    '                    <button uib-popover-template="vm.dynamicPopoverFilter.templateUrl"\n' +
                    '                            type="button"\n' +
                    '                            popover-class="filter-popover"\n' +
                    '                            popover-append-to-body="true"\n' +
                    '                            ng-click="vm.showFilterFn()"\n' +
                    '                            popover-is-open="vm.dynamicPopoverFilter.isOpen"\n' +
                    '                            ng-class="vm.popoverFilterApplied ? \'bg-info lter b-r-noradius\' : \'btn-default\'"\n' +
                    '                            popover-placement="auto bottom"\n' +
                    '                            class="btn btn-sm"><i class="fa fa-filter"></i> Filter\n' +
                    '                    </button>\n' +
                    '                    <button ng-if="vm.popoverFilterApplied" type="button"\n' +
                    '                            ng-click="vm.clearFilterFn()"\n' +
                    '                            uib-tooltip="Remove Filter" tooltip-placement="auto left"\n' +
                    '                            class="btn btn-sm btn-danger b-l-noradius"><i\n' +
                    '                            class="glyphicon closeFilter glyphicon-remove"></i></button>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Multiple Action-->\n' +
                    '                <div class="btn-group m-r-xs pull-right"\n' +
                    '                     ng-click="vm.filterPopover.isOpen = false;">\n' +
                    '                    <button class="btn btn-sm btn-default"\n' +
                    '                            ng-disabled="!vm.commCheckedList.length"\n' +
                    '                            data-toggle="dropdown">\n' +
                    '                        <i class="fa fa-gear"></i>\n' +
                    '                        Action\n' +
                    '                    </button>\n' +
                    '                    <ul class="dropdown-menu dropdown-menu-right no-padder">\n' +
                    '                        <li class=""\n' +
                    '                            ng-hide="!vm.committee_list.length"\n' +
                    '                            ng-repeat="typ in vm.bulkActionTypes"\n' +
                    '                            has-permission="{{ typ.hasPermissionFilter }}"\n' +
                    '                            has-module="{{ moduleCommittee }}"\n' +
                    '                            display-type=" ">\n' +
                    '                            <a href="javascript: void(0);"\n' +
                    '                               ng-click="vm.selectBulkActionFn(typ.id);">\n' +
                    '                                <i class="{{ typ.icon }} m-r-xs"></i>\n' +
                    '                                {{typ.name}}\n' +
                    '                            </a>\n' +
                    '                        </li>\n' +
                    '                    </ul>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Excel import/export-->\n' +
                    '                <div class="pull-right"\n' +
                    '                     ng-click="vm.filterPopover.isOpen = false;">\n' +
                    '                    <excel-operation model="\'committee\'" sample-url="\'/sample-files/committee.xlsx\'"\n' +
                    '                                     callback="vm.callbackFn(data)" class="m-t-xs"></excel-operation>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Radio button group filter will be here-->\n' +
                    '            </div>\n' +
                    '\n' +
                    '            <!--Table Headers-->\n' +
                    '            <div class="table-responsive no-padder"\n' +
                    '                 ng-if="vm.committee_list.length">\n' +
                    '                <table class="table m-b-none">\n' +
                    '                    <thead>\n' +
                    '                    <tr>\n' +
                    '                        <th>#</th>\n' +
                    '                    </tr>\n' +
                    '                    </thead>\n' +
                    '                </table>\n' +
                    '            </div>\n' +
                    '\n' +
                    '            <!--Table Contents-->\n' +
                    '            <div class="row-row">\n' +
                    '                <div class="cell">\n' +
                    '                    <div class="cell-inner">\n' +
                    '                        <div class="clearfix">\n' +
                    '                            <div class="table-responsive no-padder">\n' +
                    '                                <table class="table table-striped m-b-none"\n' +
                    '                                       ng-if="!vm.show_loading && vm.committee_list.length">\n' +
                    '                                    <tbody>\n' +
                    '                                    <tr>\n' +
                    '                                        <td>{{ $index }}</td>\n' +
                    '                                    </tr>\n' +
                    '                                    </tbody>\n' +
                    '                                </table>\n' +
                    '                            </div>\n' +
                    '\n' +
                    '                            <!--No Records Found-->\n' +
                    '                            <div class="wrapper text-center"\n' +
                    '                                 ng-if="!vm.show_loading && !vm.committee_list.length">\n' +
                    '                                <h3>No records found!</h3>\n' +
                    '                            </div>\n' +
                    '\n' +
                    '                            <!--Loader-->\n' +
                    '                            <div class="wrapper text-center"\n' +
                    '                                 ng-if="vm.show_loading">\n' +
                    '                                <h3>\n' +
                    '                                    <i class="fa fa-spin fa-spinner"></i>\n' +
                    '                                    Loading...\n' +
                    '                                </h3>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '\n' +
                    '            <!--Footer-->\n' +
                    '            <div class="wrapper-xs padder b-t centered-pagination"\n' +
                    '                 ng-if="vm.items && vm.items.length">\n' +
                    '                <!--Paste footer code here-->\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>\n' +
                    '\n' +
                    '<!--Confirm Delete Model-->\n' +
                    '<confirm-delete\n' +
                    '        message="Are you sure you want to delete this item?"\n' +
                    '        visible="vm.showDeleteModal"\n' +
                    '        confirm-delete-fn="vm.showDeleteModal = false; vm.deleteListItemFn();"\n' +
                    '        cancel-delete-fn="vm.showDeleteModal = false;">\n' +
                    '</confirm-delete>'
            },

            // Block Layout
            {
                id          : 3,
                instructions: "This layout contains header with actions, content with simple div listings and partial footer.",
                content     : '<!--Popover Template-->\n' +
                    '<script type="text/ng-template" id="myFilterPopoverTemplate.html">\n' +
                    '    <div class="col-lg-12 col-md-12 col-sm-12 col-xs-12 no-padder">\n' +
                    '        <button class="btn btn-success btn-sm pull-right m-xs m-r-none"\n' +
                    '                ng-click="vm.filterApplyFn()">Apply\n' +
                    '        </button>\n' +
                    '\n' +
                    '        <button ng-click="vm.clearFilterFn()"\n' +
                    '                class="btn btn-info btn-sm pull-right m-xs m-r-none">Reset\n' +
                    '        </button>\n' +
                    '    </div>\n' +
                    '</script>\n' +
                    '\n' +
                    '<!--Block Layout-->\n' +
                    '<div class="hbox hbox-auto-xs bg-light " ng-init="\n' +
                    '  app.settings.asideFixed = true;\n' +
                    '  app.settings.asideDock = false;\n' +
                    '  app.settings.container = false;\n' +
                    '  app.hideAside = false;\n' +
                    '  app.hideFooter = true;\n' +
                    '  ">\n' +
                    '    <div class="col">\n' +
                    '        <div class="vbox">\n' +
                    '            <!--Header-->\n' +
                    '            <div class="wrapper-sm bg-gray clearfix b-b">\n' +
                    '                <!--Module Name-->\n' +
                    '                <div class="h4 m-t-xs pull-left">\n' +
                    '                    {{ vm.moduleData.title }}\n' +
                    '                    <b class="badge bg-dark text-white">{{ vm.totalCount }}</b>\n' +
                    '\n' +
                    '                    <!--Reload Btn-->\n' +
                    '                    <button class="btn btn-sm btn-rounded p08"\n' +
                    '                            ng-class="vm.refreshLoader ? \'btn-info\' : \'btn-default b-info\'"\n' +
                    '                            ng-click="vm.refreshFn();">\n' +
                    '                        <i class="fa fa-refresh"\n' +
                    '                           ng-class="vm.refreshLoader ? \'fa-spin text-white\' : \'text-info\'"></i>\n' +
                    '                    </button>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Add-->\n' +
                    '                <button type="button"\n' +
                    '                        class="btn btn-sm btn-add pull-right"\n' +
                    '                        has-permission="{{insertPermission}}"\n' +
                    '                        has-module="{{moduleConference}}"\n' +
                    '                        ui-sref="apps.adminSetup.conference.upsert">\n' +
                    '                    Add\n' +
                    '                </button>\n' +
                    '\n' +
                    '                <!--Search box-->\n' +
                    '                <div class="pull-right m-r-xs">\n' +
                    '                    <div class="input-group">\n' +
                    '                        <input type="text"\n' +
                    '                               class="fontAwesome form-control h30"\n' +
                    '                               ng-model="vm.search"\n' +
                    '                               my-enter="vm.searchFn()"\n' +
                    '                               focus-me="vm.searchFocus"\n' +
                    '                               placeholder="Title / Identifier" />\n' +
                    '                        <span ng-if="vm.search && vm.searchApplied" ng-click="vm.resetSearchFn()" class="cad">\n' +
                    '                            <i class="fa fa-times text-danger"></i>\n' +
                    '                        </span>\n' +
                    '                        <div class="input-group-btn">\n' +
                    '                            <button type="button" class="btn btn-sm"\n' +
                    '                                    ng-class="vm.searchApplied ? \'btn-info\' : \'btn-default\'"\n' +
                    '                                    ng-click="vm.searchFn()">\n' +
                    '                                <i ng-class="vm.searchLoader ? \'fa-spinner fa-spin\' : \'fa-search\'" class="fa"></i>\n' +
                    '                            </button>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Filter - popover-->\n' +
                    '                <div class="btn-group pull-right m-r-xs">\n' +
                    '                    <button uib-popover-template="vm.dynamicPopoverFilter.templateUrl"\n' +
                    '                            type="button"\n' +
                    '                            popover-class="filter-popover"\n' +
                    '                            popover-append-to-body="true"\n' +
                    '                            ng-click="vm.showFilterFn()"\n' +
                    '                            popover-is-open="vm.dynamicPopoverFilter.isOpen"\n' +
                    '                            ng-class="vm.popoverFilterApplied ? \'bg-info lter b-r-noradius\' : \'btn-default\'"\n' +
                    '                            popover-placement="auto bottom"\n' +
                    '                            class="btn btn-sm"><i class="fa fa-filter"></i> Filter\n' +
                    '                    </button>\n' +
                    '                    <button ng-if="vm.popoverFilterApplied" type="button"\n' +
                    '                            ng-click="vm.clearFilterFn()"\n' +
                    '                            uib-tooltip="Remove Filter" tooltip-placement="auto left"\n' +
                    '                            class="btn btn-sm btn-danger b-l-noradius"><i\n' +
                    '                            class="glyphicon closeFilter glyphicon-remove"></i></button>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Multiple Action-->\n' +
                    '                <div class="btn-group m-r-xs pull-right"\n' +
                    '                     ng-click="vm.filterPopover.isOpen = false;">\n' +
                    '                    <button class="btn btn-sm btn-default"\n' +
                    '                            ng-disabled="!vm.commCheckedList.length"\n' +
                    '                            data-toggle="dropdown">\n' +
                    '                        <i class="fa fa-gear"></i>\n' +
                    '                        Action\n' +
                    '                    </button>\n' +
                    '                    <ul class="dropdown-menu dropdown-menu-right no-padder">\n' +
                    '                        <li class=""\n' +
                    '                            ng-hide="!vm.committee_list.length"\n' +
                    '                            ng-repeat="typ in vm.bulkActionTypes"\n' +
                    '                            has-permission="{{ typ.hasPermissionFilter }}"\n' +
                    '                            has-module="{{ moduleCommittee }}"\n' +
                    '                            display-type=" ">\n' +
                    '                            <a href="javascript: void(0);"\n' +
                    '                               ng-click="vm.selectBulkActionFn(typ.id);">\n' +
                    '                                <i class="{{ typ.icon }} m-r-xs"></i>\n' +
                    '                                {{typ.name}}\n' +
                    '                            </a>\n' +
                    '                        </li>\n' +
                    '                    </ul>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Excel import/export-->\n' +
                    '                <div class="pull-right"\n' +
                    '                     ng-click="vm.filterPopover.isOpen = false;">\n' +
                    '                    <excel-operation model="\'committee\'" sample-url="\'/sample-files/committee.xlsx\'"\n' +
                    '                                     callback="vm.callbackFn(data)" class="m-t-xs"></excel-operation>\n' +
                    '                </div>\n' +
                    '\n' +
                    '                <!--Radio button group filter will be here-->\n' +
                    '            </div>\n' +
                    '\n' +
                    '            <!--Contents-->\n' +
                    '            <div class="row-row">\n' +
                    '                <div class="cell">\n' +
                    '                    <div class="cell-inner">\n' +
                    '                        <div class="clearfix">\n' +
                    '                            <!--No Records Found-->\n' +
                    '                            <div class="wrapper text-center"\n' +
                    '                                 ng-if="!vm.show_loading && !vm.committee_list.length">\n' +
                    '                                <h3>No records found!</h3>\n' +
                    '                            </div>\n' +
                    '\n' +
                    '                            <!--Loader-->\n' +
                    '                            <div class="wrapper text-center"\n' +
                    '                                 ng-if="vm.show_loading">\n' +
                    '                                <h3>\n' +
                    '                                    <i class="fa fa-spin fa-spinner"></i>\n' +
                    '                                    Loading...\n' +
                    '                                </h3>\n' +
                    '                            </div>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>\n' +
                    '            </div>\n' +
                    '\n' +
                    '            <!--Footer-->\n' +
                    '            <div class="wrapper-xs padder b-t centered-pagination"\n' +
                    '                 ng-if="vm.items && vm.items.length">\n' +
                    '                <!--Paste footer code here-->\n' +
                    '            </div>\n' +
                    '        </div>\n' +
                    '    </div>\n' +
                    '</div>\n' +
                    '\n' +
                    '<!--Confirm Delete Model-->\n' +
                    '<confirm-delete\n' +
                    '        message="Are you sure you want to delete this item?"\n' +
                    '        visible="vm.showDeleteModal"\n' +
                    '        confirm-delete-fn="vm.showDeleteModal = false; vm.deleteListItemFn();"\n' +
                    '        cancel-delete-fn="vm.showDeleteModal = false;">\n' +
                    '</confirm-delete>'
            }
        ];

        vm.fuTypes = [
            {id: 1, name: 'Single'},
            {id: 2, name: 'Multiple'}
        ];
        vm.fuType  = '1';

        vm.fuTypeArr = [
            // Single Upload
            {
                id            : 1,
                defaultBtnText: 'Upload Image',
                content       : '<file-upload display-fn="displayImages(array, ind)"\n' +
                    '             btn-text="\'Browse a File\'"\n' +
                    '             width="\'75\'" height="\'75\'"\n' +
                    '             layout-type="\'horizontal\'" accept="[\'image\']" folder="\'<folder name>\'"\n' +
                    '             file="vm.uploadedFile" remove="vm.removeImage">\n' +
                    '</file-upload>'
            },

            // Multiple Upload
            {
                id            : 2,
                    defaultBtnText: 'Upload Image(s)',
                content       : '<file-upload-multiple title-name="\'Images\'"\n' +
                    '                      btn-text="\'Browse Files\'"\n' +
                    '                      layout-type="\'horizontal\'"\n' +
                    '                      height="\'100\'"\n' +
                    '                      width="\'100\'"\n' +
                    '                      display-fn="displayImages(vm.exhibitor.images,$index)"\n' +
                    '                      accept="[\'image\']"\n' +
                    '                      folder="\'<folder name>\'"\n' +
                    '                      file="vm.exhibitor.images"\n' +
                    '                      remove="vm.removeImages">\n' +
                    '</file-upload-multiple>'
            }
        ];

        vm.mainTabChangeFn = function (type, list) {
            if (type == 'common') {
                vm.activeCommon = angular.copy(list) || _.first(vm.commonList);
            }
            else if (type == 'header') {
                vm.activeHeader = angular.copy(list) || _.first(vm.headerList);
            }
            else if (type == 'body') {
                vm.activeBody = angular.copy(list) || _.first(vm.bodyList);
            }
            else if (type == 'footer') {
                vm.activeFooter = angular.copy(list) || _.first(vm.footerList);
            }
        };

        vm.activeTabFn = function (type) {
            if (type == 'common') {
                vm.activeTab = {
                    name: 'Common',
                    id  : vm.tabType.common
                };
                vm.mainTabChangeFn(type);
            }
            else if (type == 'header') {
                vm.activeTab = {
                    name: 'Header',
                    id  : vm.tabType.header
                };
                vm.mainTabChangeFn(type);
            }
            else if (type == 'body') {
                vm.activeTab = {
                    name: 'Body',
                    id  : vm.tabType.body
                };
                vm.mainTabChangeFn(type);
            }
            else if (type == 'footer') {
                vm.activeTab = {
                    name: 'Footer',
                    id  : vm.tabType.footer
                };
                vm.mainTabChangeFn(type);
            }
        };

        vm.dynamicPopover = {
            templateUrl: 'myPopoverTemplate.html',
            isOpen     : false,
            open       : function open() {
                vm.dynamicPopover.isOpen = true;
            },
            close      : function open() {
                vm.dynamicPopover.isOpen = false;
            }
        };

        vm.isOpen    = false;
        vm.mainTypes = [
            {id: 1, name: 'Type 1'},
            {id: 2, name: 'Type 2'}
        ];

        vm.activeTabFn('body');

        vm.checkModel     = {left: true, middle: true, right: false};
        vm.questDateRange = {startDate: null, endDate: null};
        $scope.bindDateRangePickerClick();

        vm.filterDateOptions = {
            "showDropdowns"      : true,
            "alwaysShowCalendars": true,
            "opens"              : "left",
            "applyClass"         : "btn-success",
            "locale"             : {
                "applyLabel"      : "Apply",
                "fromLabel"       : "From",
                "format"          : "DD-MMM-YYYY",
                "toLabel"         : "To",
                "cancelLabel"     : "Clear",
                "customRangeLabel": "Custom range"
            },
            "ranges"             : {
                "Today"     : moment().startOf('day'),
                "Last Week" : [moment().subtract(1, 'w').startOf('day'), moment().endOf('day')],
                "Last Month": [moment().subtract(1, 'M').startOf('day'), moment().endOf('day')]
            },
            "eventHandlers"      : {
                "apply.daterangepicker" : function () {
                },
                "cancel.daterangepicker": function () {
                    vm.questDateRange = {startDate: null, endDate: null};
                }
            }
        };

        vm.dateOptionsFrom = {minDate: moment()._d};

        //From and to date change fn
        vm.dateChangeFn = function (from, to) {
            if (from && from > to) {
                vm.item.end_date = angular.copy(from);
            }
            if (from) {
                vm.dateOptionsTo   = {
                    minDate: angular.copy(from)
                };
                $scope.openEndDate = true;
            }
            else {
                vm.item.end_date   = angular.copy(from);
                $scope.openEndDate = false;
            }

            if (to) {
                $scope.openEndDate = false;
            }
        };

        vm.files = [
            {path: '/sampleImgs/1.jpg', type: 1},
            {path: '/sampleImgs/2.jpg', type: 1},
            {path: '/sampleImgs/3.jpg', type: 1}
        ];

        /*-------------------------------------------------------------------------------------*/

        /*------------------------------------ Common Tab------------------------------------*/
        vm.actionBtnComponent = '<!--Action buttons with redirection-->\n' +
            '<action-buttons\n' +
            '        has-type-permission="{\n' +
            '            add : insertPermission,\n' +
            '            clone : insertPermission,\n' +
            '            edit : updatePermission,\n' +
            '            delete : deletePermission\n' +
            '        }"\n' +
            '        has-type-module="{all : <module name>}"\n' +
            '        view-exp-type="\'sref\'"\n' +
            '        clone-exp-type="\'sref\'"\n' +
            '        edit-exp-type="\'sref\'"\n' +
            '        delete-exp-type="\'fn\'"\n' +
            '        view="{sref:\'apps.viewDesignAccessPermissions\',params:{id:item.id}}"\n' +
            '        clone="{sref:\'apps.addDesignAccessPermissions\',params:{id:item.id,isClone:true}}"\n' +
            '        edit="{sref:\'apps.addDesignAccessPermissions\',params:{id:item.id}}"\n' +
            '        delete-fn="vm.deleteItemFn(false, item.id)">\n' +
            '</action-buttons>';

        vm.excelBtnComponent = '<excel-operation model="\'event\'" sample-url="\'/sample-files/event.xlsx\'"\n' +
            '                 grid="\'true\'"\n' +
            '                 callback="vm.callbackFn(data)">\n' +
            '</excel-operation>';

        vm.loaderComponent = '<content-loader is-loading="vm.show_loading"\n' +
            '                list-length="vm.masters.length"\n' +
            '                message="\'Data not found\'"></content-loader>';

        vm.urlProtocolComponent = '<url-protocol title=""\n' +
            '              placeholder="\'Enter Url\'"\n' +
            '              link-model="vm.location.url">\n' +
            '</url-protocol>';

        vm.copyBtnComponent = '<copy-btn copy-to-clipboard-fn="vm.copyToClipboardFn(null,vm.copyBtnComponent)"></copy-btn>';

        vm.paginationComponent = '<app-pagination page="vm.page"\n' +
            '                limit="vm.limit"\n' +
            '                limits-array="vm.limitsArray"\n' +
            '                total-count="vm.totalCount"\n' +
            '                list-from="vm.list_showing_from"\n' +
            '                list-to="vm.list_showing_to"\n' +
            '                default-limit-range="defaultLimitRange"\n' +
            '                limit-change-fn="vm.limitChangeFn(limit)"\n' +
            '                page-change-fn="vm.getList(page, limit);">\n' +
            '</app-pagination>';

        vm.listLayout = '<div class="hbox hbox-auto-xs bg-light " ng-init="\n' +
            '  app.settings.asideFixed = true;\n' +
            '  app.settings.asideDock = false;\n' +
            '  app.settings.container = false;\n' +
            '  app.hideAside = false;\n' +
            '  app.hideFooter = true;\n' +
            '  ">\n' +
            '    <div class="col">\n' +
            '        <div class="vbox">\n' +
            '            <!--Header-->\n' +
            '            <div class="wrapper-sm bg-gray clearfix b-b">\n' +
            '                <!--Module Name-->\n' +
            '                <div class="h4 m-t-xs pull-left">\n' +
            '                    {{ vm.moduleData.title }}\n' +
            '                    <b class="badge bg-dark text-white">{{ vm.totalCount }}</b>\n' +
            '\n' +
            '                    <!--Reload Btn-->\n' +
            '                    <button class="btn btn-sm btn-rounded p08"\n' +
            '                            ng-class="vm.refreshLoader ? \'btn-info\' : \'btn-default b-info\'"\n' +
            '                            ng-click="vm.refreshFn();">\n' +
            '                        <i class="fa fa-refresh"\n' +
            '                           ng-class="vm.refreshLoader ? \'fa-spin text-white\' : \'text-info\'"></i>\n' +
            '                    </button>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '\n' +
            '            <!--Table Headers-->\n' +
            '            <div class="table-responsive no-padder"\n' +
            '                 ng-if="vm.committee_list.length">\n' +
            '                <table class="table m-b-none">\n' +
            '                    <thead>\n' +
            '                    <tr>\n' +
            '                        <th>#</th>\n' +
            '                    </tr>\n' +
            '                    </thead>\n' +
            '                </table>\n' +
            '            </div>\n' +
            '\n' +
            '            <!--Table Contents-->\n' +
            '            <div class="row-row">\n' +
            '                <div class="cell">\n' +
            '                    <div class="cell-inner">\n' +
            '                        <div class="clearfix">\n' +
            '                            <div class="table-responsive no-padder">\n' +
            '                                <table class="table table-striped m-b-none"\n' +
            '                                       ng-if="!vm.show_loading && vm.committee_list.length">\n' +
            '                                    <tbody>\n' +
            '                                    <tr>\n' +
            '                                        <td>{{ $index }}</td>\n' +
            '                                    </tr>\n' +
            '                                    </tbody>\n' +
            '                                </table>\n' +
            '                            </div>\n' +
            '\n' +
            '                            <!--No Records Found-->\n' +
            '                            <div class="wrapper text-center"\n' +
            '                                 ng-if="!vm.show_loading && !vm.committee_list.length">\n' +
            '                                <h3>No records found!</h3>\n' +
            '                            </div>\n' +
            '\n' +
            '                            <!--Loader-->\n' +
            '                            <div class="wrapper text-center"\n' +
            '                                 ng-if="vm.show_loading">\n' +
            '                                <h3>\n' +
            '                                    <i class="fa fa-spin fa-spinner"></i>\n' +
            '                                    Loading...\n' +
            '                                </h3>\n' +
            '                            </div>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '\n' +
            '            <!--Footer-->\n' +
            '            <div class="wrapper-xs padder b-t centered-pagination"\n' +
            '                 ng-if="vm.items && vm.items.length">\n' +
            '                <!--Paste footer code here-->\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>\n' +
            '\n' +
            '<!--Confirm Delete Model-->\n' +
            '<confirm-delete\n' +
            '        message="Are you sure you want to delete this item?"\n' +
            '        visible="vm.showDeleteModal"\n' +
            '        confirm-delete-fn="vm.showDeleteModal = false; vm.deleteListItemFn();"\n' +
            '        cancel-delete-fn="vm.showDeleteModal = false;">\n' +
            '</confirm-delete>';

        vm.viewAppLayout = '<!-- hbox layout -->\n' +
            '<div class="hbox hbox-auto-xs bg-light " ng-init="\n' +
            '  app.settings.asideFixed = true;\n' +
            '  app.settings.asideDock = false;\n' +
            '  app.settings.container = false;\n' +
            '  app.hideAside = false;\n' +
            '  ">\n' +
            '    <div class="col">\n' +
            '        <div class="vbox">\n' +
            '            <!--Header-->\n' +
            '            <div class="row m-n wrapper-sm b-b b-light">\n' +
            '                <!--Left side data-->\n' +
            '                <div class="no-padder pull-left">\n' +
            '                    <span ng-if="vm.item.image" class="popup-gallery pull-left m-r-sm">\n' +
            '                        <img ng-src="{{vm.item.image}}"\n' +
            '                             ng-click="displayImages([{path:vm.item.image,type:1}], 0)"\n' +
            '                             class="img-circle"\n' +
            '                             alt="img"\n' +
            '                             height="40"\n' +
            '                             width="40" />\n' +
            '                    </span>\n' +
            '\n' +
            '                    <img ng-if="!vm.item.image"\n' +
            '                         class="img-circle pull-left m-r-sm"\n' +
            '                         src="{{noImage}}" height="40"\n' +
            '                         width="40">\n' +
            '\n' +
            '                    <span class="h4 pull-left p-l-xs">\n' +
            '                        {{vm.item.title}}\n' +
            '\n' +
            '                        <!--active-->\n' +
            '                        <span class="r-3x p05 bg-success text-white text-sm m-l-xs">\n' +
            '                            <i class="fa fa-check-circle"></i>\n' +
            '                        </span>\n' +
            '\n' +
            '                        <!--Default-->\n' +
            '                        <span ng-if="vm.item.id == vm.defaultConfId"\n' +
            '                              class="r-3x p05 bg-info text-sm text-white m-l-xs">\n' +
            '                            <i class="fa fa-check-circle"></i> Default\n' +
            '                        </span>\n' +
            '\n' +
            '                        <br>\n' +
            '                        <span ng-if="vm.item.sub_title"\n' +
            '                              class="text-sm font-thin">{{vm.item.sub_title}}</span>\n' +
            '                    </span>\n' +
            '                </div>\n' +
            '\n' +
            '                <!--Right side data : buttons-->\n' +
            '                <div class="pull-right">\n' +
            '                    <span ng-if="vm.item.parent_conference && vm.item.parent_conference.id"\n' +
            '                          style="cursor: pointer"\n' +
            '                          uib-tooltip="Click to view {{vm.item.parent_conference.title}} Detail"\n' +
            '                          tooltip-placement="bottom"\n' +
            '                          ui-sref="apps.adminSetup.conference.view({conferenceId:vm.item.parent_conference.id})"\n' +
            '                          class="r-3x p05 bg-info text-sm text-white m-r">\n' +
            '                        <b>Parent :</b> {{vm.item.parent_conference.title}}\n' +
            '                    </span>\n' +
            '\n' +
            '                    <!--Edit-->\n' +
            '                    <a href target="_blank"\n' +
            '                       class="btn btn-default text-info btn-sm m-r-xs"\n' +
            '                       has-permission="{{updatePermission}}"\n' +
            '                       has-module="{{moduleConference}}"\n' +
            '                       ui-sref="apps.adminSetup.conference.upsert({conferenceId:vm.item.id})">\n' +
            '                        Edit\n' +
            '                    </a>\n' +
            '\n' +
            '                    <!--List-->\n' +
            '                    <button class="btn btn-list btn-sm"\n' +
            '                            ui-sref="apps.adminSetup.conference.list">List\n' +
            '                    </button>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '\n' +
            '            <div class="p515 clearfix b-b bg-gray">\n' +
            '                <div class="col-lg-12 col-md-12 col-sm-12 no-padder">\n' +
            '                    <!--Identifier-->\n' +
            '                    <div class="inline m-r text-left">\n' +
            '                        <div>\n' +
            '                            <span class="text-muted">\n' +
            '                                Identifier\n' +
            '                            </span>\n' +
            '                        </div>\n' +
            '                        <div class="inline">\n' +
            '                            <span>\n' +
            '                                {{vm.item.identifier}}\n' +
            '                            </span>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '\n' +
            '                    <!--Create date-->\n' +
            '                    <div class="inline m-r text-left pull-right">\n' +
            '                        <div>\n' +
            '                            <span class="text-muted">\n' +
            '                                Created at\n' +
            '                            </span>\n' +
            '                        </div>\n' +
            '                        <div class="inline">\n' +
            '                            <span>\n' +
            '                                <small class="">\n' +
            '                                    <span class="">\n' +
            '                                        {{vm.item.createdAt  | conferenceDate}}\n' +
            '                                    </span>\n' +
            '                                </small>\n' +
            '                            </span>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '\n' +
            '            <!--Body-->\n' +
            '            <div class="row-row bg-white">\n' +
            '                <div class="cell" style="overflow: hidden !important;">\n' +
            '                    <div class="cell-inner">\n' +
            '                        <div class="hbox hbox-auto-xs">\n' +
            '                            <!--Col 1: -->\n' +
            '                            <div class="col col-lg-8 col-md-8 col-sm-8 col-xs-8 no-padder">\n' +
            '                                <div class="vbox">\n' +
            '                                    <div class="row-row bg-white">\n' +
            '                                        <div class="cell">\n' +
            '                                            <div class="cell-inner">\n' +
            '\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <!--/Col 1-->\n' +
            '\n' +
            '                            <!--Col 2: -->\n' +
            '                            <div class="col col-lg-4 col-md-4 col-sm-4 col-xs-4 no-padder b-l"\n' +
            '                                 ng-if="vm.hasUpsertPermission">\n' +
            '                                <div class="vbox">\n' +
            '                                    <div class="row-row bg-white">\n' +
            '                                        <div class="cell">\n' +
            '                                            <div class="cell-inner">\n' +
            '                                                <div class="wrapper">\n' +
            '\n' +
            '                                                </div>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                        <!--/inner cell-->\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <!--/Col 2-->\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <!--/outer cell-->\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>';

        vm.formWithTableLayout = '<!-- hbox layout -->\n' +
            '<div class="hbox hbox-auto-xs bg-light " ng-init="\n' +
            '  app.settings.asideFixed = true;\n' +
            '  app.settings.asideDock = false;\n' +
            '  app.settings.container = false;\n' +
            '  app.hideAside = false;\n' +
            '  ">\n' +
            '\n' +
            '    <!--Table Listing Column -->\n' +
            '    <div class="col">\n' +
            '        <div class="vbox">\n' +
            '            <!--Header-->\n' +
            '            <div class="wrapper-sm clearfix bg-gray b-b b-light">\n' +
            '                <!--Module Name-->\n' +
            '                <div class="h4 m-t-xs pull-left">\n' +
            '                    {{ vm.moduleData.title }}\n' +
            '                    <span class="badge bg-dark text-white">{{ vm.quest_list.length }}</span>\n' +
            '\n' +
            '                    <!--Reload Btn-->\n' +
            '                    <button class="btn btn-sm btn-rounded p08"\n' +
            '                            ng-class="vm.refreshLoader ? \'btn-info\' : \'btn-default b-info\'"\n' +
            '                            ng-click="vm.refreshFn();">\n' +
            '                        <i class="fa fa-refresh"\n' +
            '                           ng-class="vm.refreshLoader ? \'fa-spin text-white\' : \'text-info\'"></i>\n' +
            '                    </button>\n' +
            '                </div>\n' +
            '\n' +
            '                <!--Search in header-->\n' +
            '                <div class="pull-right m-r-xs">\n' +
            '                    <div class="input-group">\n' +
            '                        <input type="text"\n' +
            '                               class="fontAwesome form-control w-sm h30"\n' +
            '                               ng-model="vm.search"\n' +
            '                               my-enter="vm.searchFn()"\n' +
            '                               focus-me="vm.searchFocus"\n' +
            '                               placeholder="Name" />\n' +
            '                        <span class="cad" ng-if="vm.search && vm.searchApplied"\n' +
            '                              ng-click="vm.search = \'\'; vm.searchFn();">\n' +
            '                            <i class="fa fa-times text-danger"></i>\n' +
            '                        </span>\n' +
            '                        <div class="input-group-btn">\n' +
            '                            <button type="button" class="btn btn-sm"\n' +
            '                                    ng-class="vm.searchApplied ? \'btn-info\' : \'btn-default\'"\n' +
            '                                    ng-click="vm.searchFn();">\n' +
            '                                <i class="fa"\n' +
            '                                   ng-class="vm.searchLoader ? \'fa-spinner fa-spin\' : \'fa-search\'"></i>\n' +
            '                            </button>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '            </div>\n' +
            '\n' +
            '            <!--Content-->\n' +
            '            <div class="row-row bg-white">\n' +
            '                <div class="cell" style="overflow: hidden !important;">\n' +
            '                    <div class="cell-inner">\n' +
            '                        <div class="hbox hbox-auto-xs">\n' +
            '                            <!--Col 1: Table listings-->\n' +
            '                            <div class="col col-lg-8 col-md-8 col-sm-8 col-xs-8 no-padder">\n' +
            '                                <div class="vbox">\n' +
            '                                    <!--Table Header-->\n' +
            '                                    <div class="table-responsive no-padder">\n' +
            '                                        <table class="table m-n">\n' +
            '                                            <thead>\n' +
            '                                            <tr>\n' +
            '                                                <!--Index-->\n' +
            '                                                <th class="" width="8%" nowrap>\n' +
            '                                                    <label class="i-checks m-n">\n' +
            '                                                        <input type="checkbox"\n' +
            '                                                               ng-model="vm.checkAll"\n' +
            '                                                               ng-click="vm.checkAllQuestFn(vm.checkAll);" />\n' +
            '                                                        <i></i>\n' +
            '                                                    </label>\n' +
            '\n' +
            '                                                    #\n' +
            '                                                </th>\n' +
            '                                            </tr>\n' +
            '                                            </thead>\n' +
            '                                        </table>\n' +
            '                                    </div>\n' +
            '\n' +
            '                                    <div class="row-row bg-white">\n' +
            '                                        <div class="cell">\n' +
            '                                            <div class="cell-inner">\n' +
            '                                                <!--Table listings-->\n' +
            '                                                <div class="table-responsive"\n' +
            '                                                     ng-if="!vm.show_loading && vm.quest_list.length">\n' +
            '                                                    <table class="table table-hover table-striped m-n">\n' +
            '                                                        <tbody>\n' +
            '                                                        <tr ng-repeat="quest in vm.quest_list">\n' +
            '                                                            <!--Index-->\n' +
            '                                                            <td class="" width="8%" nowrap>\n' +
            '                                                                <label class="i-checks m-n">\n' +
            '                                                                    <input type="checkbox"\n' +
            '                                                                           ng-model="quest.isChecked"\n' +
            '                                                                           ng-click="vm.checkQuestFn();" />\n' +
            '                                                                    <i></i>\n' +
            '                                                                </label>\n' +
            '\n' +
            '                                                                {{ $index + 1 }}\n' +
            '                                                            </td>\n' +
            '                                                        </tr>\n' +
            '                                                        </tbody>\n' +
            '                                                    </table>\n' +
            '                                                </div>\n' +
            '\n' +
            '                                                <!--No entries-->\n' +
            '                                                <div class="wrapper text-center"\n' +
            '                                                     ng-if="!vm.show_loading && !vm.quest_list.length">\n' +
            '                                                    <h3>No records found!</h3>\n' +
            '                                                </div>\n' +
            '\n' +
            '                                                <!--Loader-->\n' +
            '                                                <div class="wrapper text-center"\n' +
            '                                                     ng-if="vm.show_loading">\n' +
            '                                                    <h3>\n' +
            '                                                        <i class="fa fa-spin fa-spinner"></i>\n' +
            '                                                        Loading...\n' +
            '                                                    </h3>\n' +
            '                                                </div>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <!--/Col 1-->\n' +
            '\n' +
            '                            <!--Col 2: Add/Edit form-->\n' +
            '                            <div class="col col-lg-4 col-md-4 col-sm-4 col-xs-4 no-padder b-l"\n' +
            '                                 ng-if="vm.hasUpsertPermission">\n' +
            '                                <div class="vbox">\n' +
            '                                    <div class="wrapper-sm" style="background-color: #EDF3FF;">\n' +
            '                                        <div class="h4">\n' +
            '                                            <span ng-bind="vm.quest.id ? \'Edit\' : \'Add\'"></span>&nbsp;Questionnaire\n' +
            '                                        </div>\n' +
            '                                    </div>\n' +
            '\n' +
            '                                    <div class="row-row bg-white">\n' +
            '                                        <div class="cell">\n' +
            '                                            <div class="cell-inner">\n' +
            '                                                <div class="wrapper">\n' +
            '                                                    <form name="questForm" novalidate>\n' +
            '\n' +
            '                                                    </form>\n' +
            '                                                </div>\n' +
            '                                            </div>\n' +
            '                                        </div>\n' +
            '                                        <!--/inner cell-->\n' +
            '                                    </div>\n' +
            '                                </div>\n' +
            '                            </div>\n' +
            '                            <!--/Col 2-->\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>\n' +
            '                <!--/outer cell-->\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '    <!--/col-->\n' +
            '</div>\n' +
            '\n' +
            '<!--Confirm Delete Questionnaire Modal-->\n' +
            '<confirm-delete\n' +
            '        message="Are you sure you want to delete this questionnaire(s)?"\n' +
            '        description="All the questions related to this category will also be deleted."\n' +
            '        visible="vm.showDeleteModal"\n' +
            '        confirm-delete-fn="vm.showDeleteModal = false; vm.deleteQuestConfirmFn();"\n' +
            '        cancel-delete-fn="vm.showDeleteModal = false;">\n' +
            '</confirm-delete>';

        /*------------------------------------ /Common Tab------------------------------------*/

        vm.datetimeHtml = '<datetimepicker ng-model="date"\n' +
            '                date-format="dd-MMM-yyyy"\n' +
            '                date-options="dateOptions"\n' +
            '                date-disabled="isDisabledDate(date, mode)">\n' +
            '</datetimepicker>';

        vm.dateJs = 'vm.dateOptionsFrom = {minDate: moment()._d};';

        vm.startEndJs = 'vm.dateOptionsFrom = {minDate: moment()._d};\n' +
            '\n' +
            '//From and to date change fn\n' +
            'vm.dateChangeFn = function (from, to) {\n' +
            '    if (from && from > to) {\n' +
            '        vm.item.end_date = angular.copy(from);\n' +
            '    }\n' +
            '    if (from) {\n' +
            '        vm.dateOptionsTo = {\n' +
            '            minDate: angular.copy(from)\n' +
            '        };\n' +
            '        $scope.openEndDate = true;\n' +
            '    }\n' +
            '    else {\n' +
            '        vm.item.end_date = angular.copy(from);\n' +
            '        $scope.openEndDate = false;\n' +
            '    }\n' +
            '\n' +
            '    if (to) {\n' +
            '        $scope.openEndDate = false;\n' +
            '    }\n' +
            '}';

        vm.startEndDateHtml = '<!--Start date-->\n' +
            '<div class="col-sm-4">\n' +
            '    <label>Start Date\n' +
            '        <span ng-class="basicForm.start_date.$error.required ? \'text-danger\' : \'text-success\'">*</span>\n' +
            '    </label>\n' +
            '    <span class="input-group"\n' +
            '          ng-init="openea = false">\n' +
            '            <input type="text"\n' +
            '                   class="form-control"\n' +
            '                   name="start_date"\n' +
            '                   datepicker-append-to-body="true"\n' +
            '                   placeholder="DD-MM-YYYY"\n' +
            '                   uib-datepicker-popup\n' +
            '                   ng-model="vm.item.start_date"\n' +
            '                   ng-change="vm.dateChangeFn(vm.item.start_date,vm.item.end_date);"\n' +
            '                   is-open="openea"\n' +
            '                   readonly="true"\n' +
            '                   datepicker-options="vm.dateOptionsFrom"\n' +
            '                   required />\n' +
            '            <span class="input-group-btn">\n' +
            '                <button type="button"\n' +
            '                        class="btn btn-default"\n' +
            '                        ng-click="open($event); openea = !openea">\n' +
            '                    <i class="glyphicon glyphicon-calendar"></i>\n' +
            '                </button>\n' +
            '            </span>\n' +
            '        </span>\n' +
            '</div>\n' +
            '\n' +
            '<!--End date-->\n' +
            '<div class="col-sm-4">\n' +
            '    <label>End Date\n' +
            '        <span ng-class="basicForm.end_date.$error.required ? \'text-danger\' : \'text-success\'">*</span>\n' +
            '    </label>\n' +
            '    <span class="input-group">\n' +
            '        <input type="text"\n' +
            '               class="form-control"\n' +
            '               name="end_date"\n' +
            '               ng-disabled="!vm.item.start_date"\n' +
            '               datepicker-append-to-body="true"\n' +
            '               placeholder="DD-MM-YYYY"\n' +
            '               uib-datepicker-popup\n' +
            '               ng-model="vm.conference.end_date"\n' +
            '               ng-change="vm.dateChangeFn(vm.item.start_date,vm.item.end_date);"\n' +
            '               is-open="openEndDate"\n' +
            '               readonly="true"\n' +
            '               datepicker-options="vm.dateOptionsTo" \n' +
            '               required />\n' +
            '        <span class="input-group-btn">\n' +
            '            <button type="button"\n' +
            '                    class="btn btn-default"\n' +
            '                    ng-click="open($event); openEndDate = !openEndDate">\n' +
            '                <i class="glyphicon glyphicon-calendar"></i>\n' +
            '            </button>\n' +
            '        </span>\n' +
            '    </span>\n' +
            '</div>';

        vm.dateRangeJs = '$scope.bindDateRangePickerClick();\n' +
            '\n' +
            'vm.filterDateOptions = {\n' +
            '    "showDropdowns"      : true,\n' +
            '    "alwaysShowCalendars": true,\n' +
            '    "opens"              : "left",\n' +
            '    "applyClass"         : "btn-success",\n' +
            '    "locale"             : {\n' +
            '        "applyLabel"      : "Apply",\n' +
            '        "fromLabel"       : "From",\n' +
            '        "format"          : "DD-MMM-YYYY",\n' +
            '        "toLabel"         : "To",\n' +
            '        "cancelLabel"     : "Clear",\n' +
            '        "customRangeLabel": "Custom range"\n' +
            '    },\n' +
            '    "ranges"             : {\n' +
            '        "Today"     : moment().startOf(\'day\'),\n' +
            '        "Last Week" : [moment().subtract(1, \'w\').startOf(\'day\'), moment().endOf(\'day\')],\n' +
            '        "Last Month": [moment().subtract(1, \'M\').startOf(\'day\'), moment().endOf(\'day\')]\n' +
            '    },\n' +
            '    "eventHandlers"      : {\n' +
            '        "apply.daterangepicker" : function () {},\n' +
            '        "cancel.daterangepicker": function () {\n' +
            '            vm.questDateRange = {startDate: null, endDate: null};\n' +
            '        }\n' +
            '    }\n' +
            '};';

        vm.dateRangeHtml = '<div class="drpicker w">\n' +
            '    <input type="text"\n' +
            '           class="form-control input-sm"\n' +
            '           ng-model="vm.questDateRange"\n' +
            '           date-range-picker\n' +
            '           options="vm.filterDateOptions"\n' +
            '           placeholder="Select date range"\n' +
            '           readonly />\n' +
            '    <i class="glyphicon glyphicon-calendar"></i>\n' +
            '</div>';

        vm.multiCheckBoxBtnHtml = '<div class="btn-group">\n' +
            '    <label class="btn btn-sm btn-primary" ng-model="vm.checkModel.left" uib-btn-checkbox>\n' +
            '        <i ng-if="vm.checkModel.left" class="fa fa-check"></i>Left</label>\n' +
            '    <label class="btn btn-sm btn-primary" ng-model="vm.checkModel.middle" uib-btn-checkbox>\n' +
            '        <i ng-if="vm.checkModel.middle" class="fa fa-check"></i>Middle</label>\n' +
            '    <label class="btn btn-sm btn-primary" ng-model="vm.checkModel.right" uib-btn-checkbox>\n' +
            '        <i ng-if="vm.checkModel.right" class="fa fa-check"></i>Right</label>\n' +
            '</div>';

        vm.addCellReqJs = '//Number format\n' +
            'var generalFormat = $(\'#cell\').intlTelInput(\'getNumber\');\n' +
            'var interNationalFormat = $(\'#cell\').intlTelInput(\'getNumber\', intlTelInputUtils.numberFormat.INTERNATIONAL);\n' +
            'var nationalNumber = $(\'#cell\').intlTelInput(\'getNumber\', intlTelInputUtils.numberFormat.NATIONAL);\n' +
            '\n' +
            '//selected country data and country code\n' +
            'var countryData = $(\'#cell\').intlTelInput(\'getSelectedCountryData\');\n' +
            'if (countryData) {\n' +
            'var countrycode = \'+\' + countryData.dialCode;\n' +
            '}\n' +
            '\n' +
            'if (interNationalFormat && vm.cell) {\n' +
            'vm.cell = angular.copy(interNationalFormat);\n' +
            '}';

        vm.editCellReqJs = 'if (vm.cell) {\n' +
            'vm.cell = $(\'#cell\').intlTelInput(\'setNumber\', vm.cell);\n' +
            '}';

        vm.cellNumber = '<div>\n' +
            '    <label>Cell</label>\n' +
            '    <input type="text"\n' +
            '           id="cell"\n' +
            '           name="cell"\n' +
            '           class="form-control"\n' +
            '           ng-model="vm.cell"\n' +
            '           ng-intl-tel-input />\n' +
            '</div>';

        vm.descHtml = '<div ng-if="vm.item.short_desc || vm.item.long_desc"\n' +
            '     class="col-md-12 col-sm-12 p3 b-a descBlock m-t-xs">\n' +
            '    <div class="form-group m-b-none text-md text-muted">Description</div>\n' +
            '\n' +
            '    <pre ng-if="vm.item.short_desc">{{vm.item.short_desc}}</pre>\n' +
            '    <pre ng-if="vm.item.long_desc">{{vm.item.long_desc}}</pre>\n' +
            '</div>';

        vm.descListHtml = '<pre class="b-a wrapper-xs pre-desc"\n' +
            '     ng-if="vm.desc.length">\n' +
            '    {{vm.desc}}\n' +
            '</pre>';

        vm.descHtmlTruncate = '<pre uib-popover-template="\'description-popover.html\'"\n' +
            '     popover-enable="{{vm.desc.length > 225}}"\n' +
            '     popover-class="desc-popover"\n' +
            '     popover-placement="auto bottom"\n' +
            '     popover-trigger="\'outsideClick\'"\n' +
            '     popover-is-open="vm.isOpen"\n' +
            '     popover-title="Description"\n' +
            '     popover-append-to-body="true">\n' +
            '    {{vm.desc  | truncate: 225 }}\n' +
            '        <span class="font-bold" ng-if="vm.desc.length > 225">Read More</span>\n' +
            '</pre>';

        vm.desc = 'Underscore is a JavaScript library that provides a whole mess of useful functional programming helpers without extending any built-in objects. It’s the answer to the question: “If I sit down in front of a blank HTML page, and want to start being productive immediately, what do I need?” … and the tie to go along with jQuery\'s tux and Backbone\'s suspenders.\n' +
            '\n' +
            'Underscore provides over 100 functions that support both your favorite workaday functional helpers: map, filter, invoke — as well as more specialized goodies: function binding, javascript templating, creating quick indexes, deep equality testing, and so on.\n' +
            '\n' +
            'A complete Test Suite is included for your perusal.\n' +
            '\n' +
            'You may also read through the annotated source code.\n' +
            '\n' +
            'Enjoying Underscore, and want to turn it up to 11? Try Underscore-contrib.\n' +
            '\n';

        vm.btnGroupHtml = '<div class="btn-group m-l-xs">\n' +
            '    <button class="btn btn-sm"\n' +
            '            ng-disabled="vm.gender == btn.id"\n' +
            '            ng-class="(vm.gender == btn.id ? \'btn-expand\' : \'btn-default bg-white\')"\n' +
            '            ng-repeat="btn in vm.buttons"\n' +
            '            ng-model="vm.gender"\n' +
            '            uib-btn-radio="\'{{btn.id}}\'">\n' +
            '        <i class="fa fa-check text-active"></i>\n' +
            '        {{btn.name}}\n' +
            '    </button>\n' +
            '</div>';

        vm.addActionButtons = '<button ng-click="vm.cancelFn()" class="btn btn-sm btn-default">Cancel</button>\n' +
            '<button ng-click="vm.resetFn()" class="btn btn-sm btn-info">Reset</button>\n' +
            '<button ng-click="vm.updateFn()" class="btn btn-sm btn-success">Update</button>\n' +
            '<button ng-click="vm.saveFn(true)" class="btn btn-sm btn-success">Save & Continue</button>\n' +
            '<button ng-click="vm.saveFn()" class="btn btn-sm btn-success">Save</button>';

        vm.copyToClipboardFn = CommonService.copyToClipboardFn;

        vm.mainHeaderDiv = '<div class="wrapper-sm bg-gray clearfix b-b"></div>';

        vm.badgeCount = '<b class="badge bg-dark text-white">{{vm.totalCount || 0}}</b>';

        vm.refreshButton = '<button class="btn btn-sm btn-rounded p08"\n' +
            '                            ng-class="vm.refreshLoader ? \'btn-info\' : \'btn-default b-info\'"\n' +
            '                            ng-click="vm.refreshFn();">\n' +
            '                        <i ng-class="vm.refreshLoader ? \'fa-spin text-white\' : \'text-info\'" class="fa fa-refresh"></i>\n' +
            '                    </button>';

        vm.leftSide = '<div class="pull-left m-t-xs h4">\n' +
            '    {{vm.moduleData.title}}\n' +
            '    <b class="badge bg-dark text-white">{{vm.totalCount || 0}}</b>\n' +
            '\n' +
            '    <button class="btn btn-sm btn-rounded p08" ng-click="vm.refreshFn();"\n' +
            '            ng-class="vm.refreshLoader ? \'btn-info\' : \'btn-default b-info\'">\n' +
            '        <i ng-class="vm.refreshLoader ? \'fa-spin text-white\' : \'text-info\'" class="fa fa-refresh"></i>\n' +
            '    </button>\n' +
            '</div>';

        vm.searchButton   = '<!--Search box-->\n' +
            '                <div class="pull-right m-r-xs">\n' +
            '                    <div class="input-group">\n' +
            '                        <input type="text"\n' +
            '                               class="fontAwesome form-control h30"\n' +
            '                               ng-model="vm.search"\n' +
            '                               my-enter="vm.searchFn()"\n' +
            '                               focus-me="vm.searchFocus"\n' +
            '                               placeholder="Title / Identifier" />\n' +
            '                        <span ng-if="vm.search && vm.searchApplied" ng-click="vm.resetSearchFn()" class="cad">\n' +
            '                            <i class="fa fa-times text-danger"></i>\n' +
            '                        </span>\n' +
            '                        <div class="input-group-btn">\n' +
            '                            <button type="button" class="btn btn-sm"\n' +
            '                                    ng-class="vm.searchApplied ? \'btn-info\' : \'btn-default\'"\n' +
            '                                    ng-click="vm.searchFn()">\n' +
            '                                <i ng-class="vm.searchLoader ? \'fa-spinner fa-spin\' : \'fa-search\'" class="fa"></i>\n' +
            '                            </button>\n' +
            '                        </div>\n' +
            '                    </div>\n' +
            '                </div>';
        vm.filterButton   = '<!--Filter - popover-->\n' +
            '                <div class="btn-group pull-right m-r-xs">\n' +
            '                    <button uib-popover-template="vm.dynamicPopoverFilter.templateUrl"\n' +
            '                            type="button"\n' +
            '                            popover-class="filter-popover"\n' +
            '                            popover-append-to-body="true"\n' +
            '                            ng-click="vm.showFilterFn()"\n' +
            '                            popover-is-open="vm.dynamicPopoverFilter.isOpen"\n' +
            '                            ng-class="vm.popoverFilterApplied ? \'bg-info lter b-r-noradius\' : \'btn-default\'"\n' +
            '                            popover-placement="auto bottom"\n' +
            '                            class="btn btn-sm"><i class="fa fa-filter"></i> Filter\n' +
            '                    </button>\n' +
            '                    <button ng-if="vm.popoverFilterApplied" type="button"\n' +
            '                            ng-click="vm.clearFilterFn()"\n' +
            '                            uib-tooltip="Remove Filter" tooltip-placement="auto left"\n' +
            '                            class="btn btn-sm btn-danger b-l-noradius"><i\n' +
            '                            class="glyphicon closeFilter glyphicon-remove"></i></button>\n' +
            '                </div>';
        vm.btnGroupFilter = ' <!--Radio button group filter-->\n' +
            '                <div class="btn-group pull-right m-r-xs">\n' +
            '                    <button class="btn btn-sm "\n' +
            '                            ng-disabled="vm.conferenceFilterType == filter.id"\n' +
            '                            ng-class="(vm.conferenceFilterType == filter.id ? \'btn-expand\' : \'btn-default bg-white\')"\n' +
            '                            ng-repeat="filter in vm.conferenceFilters"\n' +
            '                            ng-click="vm.changeConferenceFilterFn()"\n' +
            '                            ng-model="vm.conferenceFilterType"\n' +
            '                            uib-btn-radio="\'{{filter.id}}\'">\n' +
            '                        <i class="fa fa-check text-active"></i>\n' +
            '                        <label ng-if="filter.label"\n' +
            '                               tooltip-placement="auto bottom"\n' +
            '                               class="badge badge-gray m-b-none text-dark-imp">\n' +
            '                            {{filter.label}}\n' +
            '                        </label>\n' +
            '                        {{filter.name}}\n' +
            '                    </button>\n' +
            '                </div>';

        vm.multipleActionButton = '<!--Multiple Action-->\n' +
            '                <div class="btn-group m-r-xs pull-right"\n' +
            '                     ng-click="vm.filterPopover.isOpen = false;">\n' +
            '                    <button class="btn btn-sm btn-default"\n' +
            '                            ng-disabled="!vm.commCheckedList.length"\n' +
            '                            data-toggle="dropdown">\n' +
            '                        <i class="fa fa-gear"></i>\n' +
            '                        Action\n' +
            '                    </button>\n' +
            '                    <ul class="dropdown-menu dropdown-menu-right no-padder">\n' +
            '                        <li class=""\n' +
            '                            ng-hide="!vm.committee_list.length"\n' +
            '                            ng-repeat="typ in vm.bulkActionTypes"\n' +
            '                            has-permission="{{ typ.hasPermissionFilter }}"\n' +
            '                            has-module="{{ moduleCommittee }}"\n' +
            '                            display-type=" ">\n' +
            '                            <a href="javascript: void(0);"\n' +
            '                               ng-click="vm.selectBulkActionFn(typ.id);">\n' +
            '                                <i class="{{ typ.icon }} m-r-xs"></i>\n' +
            '                                {{typ.name}}\n' +
            '                            </a>\n' +
            '                        </li>\n' +
            '                    </ul>\n' +
            '                </div>';
        vm.excelImport          = ' <!--Excel import/export-->\n' +
            '                <div class="pull-right"\n' +
            '                     ng-click="vm.filterPopover.isOpen = false;">\n' +
            '                    <excel-operation model="\'committee\'" sample-url="\'/sample-files/committee.xlsx\'"\n' +
            '                                     callback="vm.callbackFn(data)" class="m-t-xs"></excel-operation>\n' +
            '                </div>';

        vm.rightSide = '<!--Add-->\n' +
            '<button type="button"\n' +
            '        class="btn btn-sm btn-add pull-right"\n' +
            '        has-permission="{{insertPermission}}"\n' +
            '        has-module="{{moduleConference}}"\n' +
            '        ui-sref="apps.adminSetup.conference.upsert">\n' +
            '    Add\n' +
            '</button>\n' +
            '\n' +
            '<!--Search box-->\n' +
            '<div class="pull-right m-r-xs">\n' +
            '    <div class="input-group">\n' +
            '        <input type="text"\n' +
            '               class="fontAwesome form-control h30"\n' +
            '               ng-model="vm.search"\n' +
            '               my-enter="vm.searchFn()"\n' +
            '               focus-me="vm.searchFocus"\n' +
            '               placeholder="Title / Identifier" />\n' +
            '        <span ng-if="vm.search && vm.searchApplied" ng-click="vm.resetSearchFn()" class="cad">\n' +
            '            <i class="fa fa-times text-danger"></i>\n' +
            '        </span>\n' +
            '        <div class="input-group-btn">\n' +
            '            <button type="button" class="btn btn-sm"\n' +
            '                    ng-class="vm.searchApplied ? \'btn-info\' : \'btn-default\'"\n' +
            '                    ng-click="vm.searchFn()">\n' +
            '                <i ng-class="vm.searchLoader ? \'fa-spinner fa-spin\' : \'fa-search\'" class="fa"></i>\n' +
            '            </button>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>\n' +
            '\n' +
            '<!--Filter - popover-->\n' +
            '<div class="btn-group pull-right m-r-xs">\n' +
            '    <button uib-popover-template="vm.dynamicPopoverFilter.templateUrl"\n' +
            '            type="button"\n' +
            '            popover-class="filter-popover"\n' +
            '            popover-append-to-body="true"\n' +
            '            ng-click="vm.showFilterFn()"\n' +
            '            popover-is-open="vm.dynamicPopoverFilter.isOpen"\n' +
            '            ng-class="vm.popoverFilterApplied ? \'bg-info lter b-r-noradius\' : \'btn-default\'"\n' +
            '            popover-placement="auto bottom"\n' +
            '            class="btn btn-sm"><i class="fa fa-filter"></i> Filter\n' +
            '    </button>\n' +
            '    <button ng-if="vm.popoverFilterApplied" type="button"\n' +
            '            ng-click="vm.clearFilterFn()"\n' +
            '            uib-tooltip="Remove Filter" tooltip-placement="auto left"\n' +
            '            class="btn btn-sm btn-danger b-l-noradius"><i\n' +
            '            class="glyphicon closeFilter glyphicon-remove"></i></button>\n' +
            '</div>\n' +
            '\n' +
            '<!--Multiple Action-->\n' +
            '<div class="btn-group m-r-xs pull-right"\n' +
            '     ng-click="vm.filterPopover.isOpen = false;">\n' +
            '    <button class="btn btn-sm btn-default"\n' +
            '            ng-disabled="!vm.commCheckedList.length"\n' +
            '            data-toggle="dropdown">\n' +
            '        <i class="fa fa-gear"></i>\n' +
            '        Action\n' +
            '    </button>\n' +
            '    <ul class="dropdown-menu dropdown-menu-right no-padder">\n' +
            '        <li class=""\n' +
            '            ng-hide="!vm.committee_list.length"\n' +
            '            ng-repeat="typ in vm.bulkActionTypes"\n' +
            '            has-permission="{{ typ.hasPermissionFilter }}"\n' +
            '            has-module="{{ moduleCommittee }}"\n' +
            '            display-type=" ">\n' +
            '            <a href="javascript: void(0);"\n' +
            '               ng-click="vm.selectBulkActionFn(typ.id);">\n' +
            '                <i class="{{ typ.icon }} m-r-xs"></i>\n' +
            '                {{typ.name}}\n' +
            '            </a>\n' +
            '        </li>\n' +
            '    </ul>\n' +
            '</div>\n' +
            '\n' +
            '<!--Excel import/export-->\n' +
            '<div class="pull-right"\n' +
            '     ng-click="vm.filterPopover.isOpen = false;">\n' +
            '    <excel-operation model="\'committee\'" sample-url="\'/sample-files/committee.xlsx\'"\n' +
            '                     callback="vm.callbackFn(data)" class="m-t-xs"></excel-operation>\n' +
            '</div>\n' +
            '\n' +
            '<!--Radio button group filter will be here-->';


        vm.fullHeaderDiv = '<div class="wrapper-sm bg-gray clearfix b-b">\n' +
            '\n' +
            '    <!--Left side div-->\n' +
            '    <div class="pull-left m-t-xs h4">\n' +
            '        {{vm.moduleData.title}}\n' +
            '        <b class="badge bg-dark text-white">{{vm.totalCount || 0}}</b>\n' +
            '\n' +
            '        <button class="btn btn-sm btn-rounded p08"\n' +
            '                ng-class="vm.refreshLoader ? \'btn-info\' : \'btn-default b-info\'"\n' +
            '                ng-click="vm.refreshFn();">\n' +
            '            <i ng-class="vm.refreshLoader ? \'fa-spin text-white\' : \'text-info\'" class="fa fa-refresh"></i>\n' +
            '        </button>\n' +
            '    </div>\n' +
            '\n' +
            '    <!--Add-->\n' +
            '    <button type="button"\n' +
            '            class="btn btn-sm btn-add pull-right"\n' +
            '            has-permission="{{insertPermission}}"\n' +
            '            has-module="{{moduleConference}}"\n' +
            '            ui-sref="apps.adminSetup.conference.upsert">\n' +
            '        Add\n' +
            '    </button>\n' +
            '\n' +
            '    <!--Search box-->\n' +
            '    <div class="pull-right m-r-xs">\n' +
            '        <div class="input-group">\n' +
            '            <input type="text"\n' +
            '                   class="fontAwesome form-control h30"\n' +
            '                   ng-model="vm.search"\n' +
            '                   my-enter="vm.searchFn()"\n' +
            '                   focus-me="vm.searchFocus"\n' +
            '                   placeholder="Title / Identifier" />\n' +
            '            <span ng-if="vm.search && vm.searchApplied" ng-click="vm.resetSearchFn()" class="cad">\n' +
            '                        <i class="fa fa-times text-danger"></i>\n' +
            '                    </span>\n' +
            '            <div class="input-group-btn">\n' +
            '                <button type="button" class="btn btn-sm"\n' +
            '                        ng-class="vm.searchApplied ? \'btn-info\' : \'btn-default\'"\n' +
            '                        ng-click="vm.searchFn()">\n' +
            '                    <i ng-class="vm.searchLoader ? \'fa-spinner fa-spin\' : \'fa-search\'" class="fa"></i>\n' +
            '                </button>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '\n' +
            '    <!--Filter - popover-->\n' +
            '    <div class="btn-group pull-right m-r-xs">\n' +
            '        <button uib-popover-template="vm.dynamicPopoverFilter.templateUrl"\n' +
            '                type="button"\n' +
            '                popover-class="filter-popover"\n' +
            '                popover-append-to-body="true"\n' +
            '                ng-click="vm.showFilterFn()"\n' +
            '                popover-is-open="vm.dynamicPopoverFilter.isOpen"\n' +
            '                ng-class="vm.popoverFilterApplied ? \'bg-info lter b-r-noradius\' : \'btn-default\'"\n' +
            '                popover-placement="auto bottom"\n' +
            '                class="btn btn-sm"><i class="fa fa-filter"></i> Filter\n' +
            '        </button>\n' +
            '        <button ng-if="vm.popoverFilterApplied" type="button"\n' +
            '                ng-click="vm.clearFilterFn()"\n' +
            '                uib-tooltip="Remove Filter" tooltip-placement="auto left"\n' +
            '                class="btn btn-sm btn-danger b-l-noradius"><i\n' +
            '                class="glyphicon closeFilter glyphicon-remove"></i></button>\n' +
            '    </div>\n' +
            '\n' +
            '    <!--Multiple Action-->\n' +
            '    <div class="btn-group m-r-xs pull-right"\n' +
            '         ng-click="vm.filterPopover.isOpen = false;">\n' +
            '        <button class="btn btn-sm btn-default"\n' +
            '                ng-disabled="!vm.commCheckedList.length"\n' +
            '                data-toggle="dropdown">\n' +
            '            <i class="fa fa-gear"></i>\n' +
            '            Action\n' +
            '        </button>\n' +
            '        <ul class="dropdown-menu dropdown-menu-right no-padder">\n' +
            '            <li class=""\n' +
            '                ng-hide="!vm.committee_list.length"\n' +
            '                ng-repeat="typ in vm.bulkActionTypes"\n' +
            '                has-permission="{{ typ.hasPermissionFilter }}"\n' +
            '                has-module="{{ moduleCommittee }}"\n' +
            '                display-type=" ">\n' +
            '                <a href="javascript: void(0);"\n' +
            '                   ng-click="vm.selectBulkActionFn(typ.id);">\n' +
            '                    <i class="{{ typ.icon }} m-r-xs"></i>\n' +
            '                    {{typ.name}}\n' +
            '                </a>\n' +
            '            </li>\n' +
            '        </ul>\n' +
            '    </div>\n' +
            '\n' +
            '    <!--Excel import/export-->\n' +
            '    <div class="pull-right"\n' +
            '         ng-click="vm.filterPopover.isOpen = false;">\n' +
            '        <excel-operation model="\'committee\'" sample-url="\'/sample-files/committee.xlsx\'"\n' +
            '                         callback="vm.callbackFn(data)" class="m-t-xs"></excel-operation>\n' +
            '    </div>\n' +
            '\n' +
            '    <!--radio button group filter-->\n' +
            '    <div class="btn-group pull-right m-r-xs">\n' +
            '        <button class="btn btn-sm "\n' +
            '                ng-disabled="vm.conferenceFilterType == filter.id"\n' +
            '                ng-class="(vm.conferenceFilterType == filter.id ? \'btn-expand\' : \'btn-default bg-white\')"\n' +
            '                ng-repeat="filter in vm.conferenceFilters"\n' +
            '                ng-click="vm.changeConferenceFilterFn()"\n' +
            '                ng-model="vm.conferenceFilterType"\n' +
            '                uib-btn-radio="\'{{filter.id}}\'">\n' +
            '            <i class="fa fa-check text-active"></i>\n' +
            '            <label ng-if="filter.label"\n' +
            '                   tooltip-placement="auto bottom"\n' +
            '                   class="badge badge-gray m-b-none text-dark-imp">\n' +
            '                {{filter.label}}\n' +
            '            </label>\n' +
            '            {{filter.name}}\n' +
            '        </button>\n' +
            '    </div>\n' +
            '\n' +
            '</div>';

        vm.fullFooterDiv = '<!--Fix row-->\n' +
            '<div class="wrapper-xs padder b-t centered-pagination"\n' +
            '     ng-if="vm.items && vm.items.length">\n' +
            '    <div class="col-sm-3 no-padder">\n' +
            '        <div class="input-group w-sm">\n' +
            '                <span class="input-group-btn">\n' +
            '                    <button class="btn btn-sm btn-default limitButton" type="button">Limit</button>\n' +
            '                </span>\n' +
            '            <select ng-model="vm.limit"\n' +
            '                    ng-change="vm.limitChangeFn()"\n' +
            '                    class="input-sm  form-control w-sm inline v-middle">\n' +
            '                <option ng-repeat="lmt in vm.limitsArray"\n' +
            '                        ng-show="$index == 0 || vm.totalCount > vm.limitsArray[$index - 1].limit"\n' +
            '                        value="{{lmt.limit}}">{{lmt.limit}}\n' +
            '                </option>\n' +
            '                <option value="-1">All</option>\n' +
            '            </select>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '\n' +
            '    <div class="col-sm-4 text-right">\n' +
            '        <small class="text-muted inline m-t-xs">\n' +
            '            Showing\n' +
            '            <span ng-if="vm.totalCount > 1">{{vm.list_showing_from}} - {{vm.list_showing_to}}</span>\n' +
            '            <span ng-if="vm.totalCount == 1">1</span>\n' +
            '            of {{vm.totalCount}}\n' +
            '            <span ng-if="vm.totalCount > 1">Entries</span>\n' +
            '            <span ng-if="vm.totalCount == 1">Entry</span>\n' +
            '        </small>\n' +
            '    </div>\n' +
            '\n' +
            '    <div class="col-sm-5 text-right no-padder line1">\n' +
            '        <div uib-pagination total-items="vm.totalCount"\n' +
            '             ng-model="vm.page"\n' +
            '             max-size="vm.maxSize"\n' +
            '             items-per-page="vm.limit"\n' +
            '             ng-change="vm.getList(vm.page, vm.limit);"\n' +
            '             class="pagination-sm m-b-none"\n' +
            '             boundary-links="true"\n' +
            '             previous-text="&lsaquo;"\n' +
            '             next-text="&rsaquo;"\n' +
            '             first-text="&laquo;"\n' +
            '             last-text="&raquo;"\n' +
            '             num-pages="numPages"></div>\n' +
            '    </div>\n' +
            '</div>\n' +
            '<!-- /Fix row-->';


        vm.fullFooterJs = 'vm.defaultLimitRange = [\n' +
            '    {limit: \'25\'},\n' +
            '    {limit: \'50\'},\n' +
            '    {limit: \'100\'},\n' +
            '    {limit: \'200\'},\n' +
            '    {limit: \'500\'},\n' +
            '    {limit: \'1000\'}\n' +
            '];\n' +
            '\n' +
            'vm.limit = _.first(vm.defaultLimitRange).limit;\n' +
            'var findDefaultLimitIndex = _.findIndex(vm.defaultLimitRange, {limit: vm.limit});\n' +
            'vm.limitsArray = vm.defaultLimitRange.slice(findDefaultLimitIndex);';


        vm.uibTooltipHtml  = 'uib-tooltip-html="\'static. {{vm.dynamicTooltipText}}. <b>bold.</b>\'"';
        vm.uibTooltipClass = 'tooltip-class="customTooltipClass"';

        vm.uibPopoverTemplate = 'uib-popover-template="vm.dynamicPopover.templateUrl"';
        vm.uibPopoverHtml     = 'uib-popover-html="\'<b>HTML</b>, <i>inline</i>\'"';

        vm.singleUiSelect = '<ui-select ng-model="vm.type"\n' +
            '           ng-change="vm.changeFn()"\n' +
            '           theme="bootstrap">\n' +
            '    <ui-select-match\n' +
            '            placeholder="Select type">\n' +
            '        {{$select.selected.name}}\n' +
            '    </ui-select-match>\n' +
            '    <ui-select-choices\n' +
            '            repeat="type.id as type in vm.mainTypes | filter: $select.search">\n' +
            '        <div ng-bind-html="type.name | highlight: $select.search"></div>\n' +
            '    </ui-select-choices>\n' +
            '</ui-select>';

        vm.multiUiSelect = '<ui-select ng-model="vm.tags"\n' +
            '           theme="bootstrap"\n' +
            '           close-on-select="false"\n' +
            '           reset-search-input="false"\n' +
            '           append-to-body="true"\n' +
            '           multiple>\n' +
            '    <ui-select-match placeholder="Select Types">\n' +
            '        {{$item.name}}\n' +
            '    </ui-select-match>\n' +
            '    <ui-select-choices\n' +
            '            repeat="tag.id as tag in vm.mainTypes | filter: $select.search">\n' +
            '        <div>\n' +
            '            {{tag.name | highlight: $select.search}}\n' +
            '        </div>\n' +
            '    </ui-select-choices>\n' +
            '</ui-select>';

        vm.multiUiSelectApi = '<ui-select ng-model="vm.tags"\n' +
            '           theme="bootstrap"\n' +
            '           close-on-select="false"\n' +
            '           reset-search-input="false"\n' +
            '           append-to-body="true"\n' +
            '           multiple>\n' +
            '    <ui-select-match placeholder="Select Types">\n' +
            '        {{$item.name}}\n' +
            '    </ui-select-match>\n' +
            '    <ui-select-choices\n' +
            '            repeat="item in vm.list"\n' +
            '            refresh="vm.searchUsersFn($select.search);"\n' +
            '            minimum-input-length="1"\n' +
            '            refresh-delay="200">\n' +
            '        <div>\n' +
            '            {{item.name | highlight: $select.search}}\n' +
            '        </div>\n' +
            '    </ui-select-choices>\n' +
            '</ui-select>';

        vm.setFocus = '<ui-select focus-on=\'SetFocus\'></ui-select>\n' +
            '<button ng-click="setInputFocus()">Set Focus</button>';

        vm.refreshUiSelect = '<ui-select-choices\n' +
            '        repeat="user in vm.list"\n' +
            '        refresh="vm.searchUsersFn($select.search);"\n' +
            '        minimum-input-length="1"\n' +
            '        refresh-delay="200">';

        vm.uiSelectConfig = 'app.config(function(uiSelectConfig) {\n' +
            '    uiSelectConfig.theme = \'bootstrap\';\n' +
            '    uiSelectConfig.resetSearchInput = true;\n' +
            '    uiSelectConfig.appendToBody = true;\n' +
            '});';

        // Clear vm
        $scope.$on('$destroy', function () {
            vm = [];
        });

    }

})();
