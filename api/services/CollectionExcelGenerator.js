/**
 * common functions for all
 * @description
 * @type {{}}
 */

const Excel = require('exceljs');
const path = require('path');
//const findRemoveSync = require("find-remove");
var fs = require('fs');
var _ = require('lodash');
const EXCEL_CELL_FONT_FAMILY = 'arial';
const EXCEL_CELL_FONT_COLOR_NUM = 'red';
const EXCEL_CELL_FONT_SIZE = 8;
module.exports = {
    /**
     * @function generateExcel
     * @description generate excel from grid
     * @param options : "{
     *                      "data":[{}]
     *                      "extension":<string>
     *                      "columns":[{}]
     *                      "excelName":<string>
     *                      "sheetName":<string>
     *                  }"
     * @param  return <promise>
     * @author Bhavesh Bheda
     */
    async generateExcel(options) {
        var destPath = path.join(sails.config.appPath, '/.tmp/public/excel-temp/');
        var excelName = Math.random() * 1000;
        var extension = '.xlsx';
        var gridColumn = options.columns;
        let PopulateMapper = sails.config.services.populateExcelMapper;
        if (options.excelName) {
            excelName = options.excelName;
        }
        // set extension to excel name
        if (options.extension && options.extension.toLowerCase() == 'csv') {
            extension = '.csv';
        }
        // check file is already exist or note
        excelName = await new Promise((resolve, reject) => {
            fs.stat(destPath + excelName + extension, function (err, stat) {
                if (err == null) {
                    resolve(excelName + '-' + UtilService.randomString(4, '01234567890123456789') + extension);
                } else {
                    resolve(excelName + extension);
                }

            });
        });
        // Creating Workbook
        var workbook = new Excel.Workbook();
        var sheet = workbook.addWorksheet(options.sheetName ? options.sheetName : 'Sheet-1');
        var excelColumn = [];
        // set header
        let columnBasicConfig = {
            alignment: {
                vertical: 'middle',
                horizontal: 'center'
            },
            style: {
                numFmt: '0.00',
                font: {
                    name: EXCEL_CELL_FONT_FAMILY,
                    color: {argb: EXCEL_CELL_FONT_COLOR_NUM},
                    family: 2,
                    size: EXCEL_CELL_FONT_SIZE + 2,
                    bold: true
                }
            }
        };
        _.forEach(gridColumn, (column, cb) => {
            var hidden = false;
            if (sails.config.services.nonExportFields.indexOf(column.field) >= 0) {
                hidden = true;
            }
            excelColumn.push(_.extend({
                header: column.title,
                key: column.field,
                width: column.excel_column_width || 8,
                hidden: hidden
            }, columnBasicConfig));
        });
        _.each(options.model.attributes, (attr, key) => {
            if (attr.model) {
                excelColumn.push(_.extend({
                    header: (key + '_model').toUpperCase(),
                    key: key + '_model',
                    width: 8,
                    hidden: true
                }, columnBasicConfig));
            }
        });
        sheet.columns = excelColumn;
        // set data in sheet by column
        var srNo = 1;
        _.each(options.data, (d) => {
            var obj = {};
            _.each(gridColumn, function (column) {


                if (column.field == 'srNo') {
                    obj[column.field] = srNo;
                    srNo++;
                } else {
                    // separate column info
                    var columnField = column.field.split('.');
                    let fieldSchema = options.model.attributes[column.field];

                    if (columnField.length == 2) {
                        if (d[columnField[0]] != null && d[columnField[0]][columnField[1]] != null) {
                            let value = d[columnField[0]][columnField[1]];
                            // is boolean
                            if (_.isBoolean(value)) {
                                obj[column.field] = value ? 'YES' : 'NO';
                            } else if (_.isNumber(value)) { // is Numeric
                                obj[column.field] = value;
                            } else {// default String
                                obj[column.field] = value.toString();
                            }
                        } else {// Empty
                            obj[column.field] = '-';
                        }
                    }
                    else if (d[columnField[0]] != null) {
                        // is Bool
                        if (_.isBoolean(d[columnField[0]])) {
                            obj[column.field] = d[columnField[0]] ? 'YES' : 'NO';
                        }

                        // is numeric
                        else if (_.isNumber(d[columnField[0]])) {
                            obj[column.field] = d[columnField[0]];
                        } else if (_.isArray(d[columnField[0]])) { // is array
                            if (_.size(d[columnField[0]]) > 0) {//value is not null
                                let firstValue = _.first(d[columnField[0]]);
                                if (_.isObject(firstValue)) {//is object
                                    obj[column.field] = JSON.stringify(d[columnField[0]]);
                                } else {//is string
                                    obj[column.field] = d[columnField[0]].join(',');
                                }
                            } else {//null
                                obj[column.field] = '';
                            }
                        } else {  // string
                            if (fieldSchema.model) {
                                obj[column.field] = d[columnField[0]][PopulateMapper[fieldSchema.model].populateField];
                                obj[column.field + '_model'] = d[columnField[0]].id;
                            } else {
                                obj[column.field] = d[columnField[0]].toString();
                            }
                        }
                    } else {// Empty
                        obj[column.field] = '-';
                    }
                }
            });
            sheet.addRow(obj);
        });
        // Formatting Rows common row style
        sheet.eachRow({includeEmpty: true}, function (row, rowNumber) {
            row.style = {
                numFmt: '0000.00',
            };
            // Specify border
            row.eachCell({includeEmpty: true}, function (cell, colNumber) {
                if (rowNumber == 1) {
                    cell.style = {
                        font: {
                            name: EXCEL_CELL_FONT_FAMILY,
                            size: EXCEL_CELL_FONT_SIZE + 2,
                            family: 4,
                            underline: true,
                            bold: true
                        },
                        alignment: {
                            vertical: 'middle',
                            horizontal: 'center'
                        },
                        border: {
                            top: {style: 'thin'},
                            left: {style: 'thin'},
                            bottom: {style: 'thin'},
                            right: {style: 'thin'}
                        }
                    };
                }
                else {
                    cell.style = {
                        font: {
                            name: EXCEL_CELL_FONT_FAMILY,
                            size: EXCEL_CELL_FONT_SIZE,
                            family: 4,
                            //  underline: true,
                            //  bold: true
                        },
                        border: {
                            top: {style: 'thin'},
                            left: {style: 'thin'},
                            bottom: {style: 'thin'},
                            right: {style: 'thin'}
                        }
                    };
                }
            });
            row.commit();
        });
        return new Promise((resolve, reject) => {
            workbook.xlsx.writeFile(destPath + excelName).then(function () {
                resolve({
                    flag: true,
                    data: '/excel-temp/' + excelName,
                    excelPath: destPath + excelName,
                    excelName: excelName,
                    message: 'Success'
                });
            });
        });
    },

    /**
     * generate excel by model
     * @param options={
     *              Model:<model>
     * }
     * @returns {Promise.<void>}
     */
    async generateExcelByModel(options) {
        let requestObj = {};
        let Model = sails.models[options.Model];
        if (options.columns) {
            requestObj.columns = options.columns;
        }
        else {
            // get all keys of model
            let columns = [];
            _.each(Model.attributes, (attr, key) => {
                if (attr.type === 'json' && attr.columnType !== 'array') {
                    _.each(attr.description, (subField, k) => {
                        columns.push({
                            title: (key + '.' + k).replace(/([A-Z])/g, ' $1').toUpperCase(),
                            field: key + '.' + k
                        });
                    });
                } else {
                    columns.push({
                        title: key.replace(/([A-Z])/g, ' $1').toUpperCase(),
                        field: key
                    });
                }
            });
            requestObj.columns = columns;
        }
        // get data
        if (options.data) {
            requestObj.data = options.data;
        }
        let where = {};
        if (Model.attributes.conference_id) {
            where = {
                conference_id: options.conference_id
            };
        }
        requestObj.data = await Model.find(where).populateAll();
        requestObj.model = Model;
        //add other detail like extension,sheet name, etc...
        if (options.extension) {
            requestObj.extension = options.extension;
        }
        if (options.sheetName) {
            requestObj.sheetName = options.sheetName;
        }
        return this.generateExcel(requestObj);
    },

    /**
     *
     * @param option={
     *          removed:[<dir path from root of project>]
     * }
     * @returns {Promise.<removed>}
     */
    async removeOldFileDir(option) {
        for (let dir in option.removed) {
            return findRemoveSync(path.join(sails.config.appPath, dir), {
                age: {seconds: 3600},
                dir: '*',
                files: '*.*',
                ignore: 'index.html'
            });
        }

    },
    /**
     *
     * @param path
     * @returns {Array}
     */
    async excelToJson(path) {
        let workbook = new Excel.Workbook();
        await workbook.xlsx.readFile(path);
        let workSheet = workbook.getWorksheet(1);
        let rows = [];
        let column = [];
        workSheet.eachRow({}, function (row, rowNumber) {
            let data = row.values.slice(1);
            if (rowNumber === 1) {
                column = data;
            } else {
                let json = {};
                _.each(column, (key, index) => {
                    json[key] = data[index];
                });
                rows.push(json);
            }
        });
        return rows;
    },
    formatSheetRecordsToImport(records, model) {
        let response = [];
        _.each(records, (row) => {
            let json = {};
            _.each(row, async (fieldValue, key) => {
                if (key !== 'SR NO' && (fieldValue !== '' && fieldValue !== '-')) {
                    key = key.toLowerCase();
                    if (key === 'created at') {
                        key = 'createdAt';
                    } else if (key === 'updated at') {
                        key = 'updatedAt';
                    }
                    if (model.attributes[key]) {
                        if (model.attributes[key].type) {
                            if (model.attributes[key].autoMigrations.columnType && model.attributes[key].autoMigrations.columnType.toLowerCase() === 'array') {
                                if (_.size(fieldValue) > 0 && !_.isObject(fieldValue[0])) {
                                    fieldValue = fieldValue.split(',');
                                }
                            }
                        } else if (model.attributes[key].model) {
                            fieldValue = '';
                            if (row[key.toUpperCase() + '_MODEL']) {
                                fieldValue = row[key.toUpperCase() + '_MODEL'];
                            }
                        }
                    } else {
                        fieldValue = '';
                    }
                    if (fieldValue === 'NO') {
                        fieldValue = false;
                    } else if (fieldValue === 'YES') {
                        fieldValue = true;
                    }
                    json[key] = fieldValue;
                }
            });
            response.push(json);
        });

        return response;
    }
};
