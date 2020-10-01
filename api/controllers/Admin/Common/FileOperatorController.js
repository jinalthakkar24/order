/**
 * @module FileOperator
 * @description :: helps to do file operations
 */
var path = require('path');
var fs = require('fs');
var async = require('async');
var FileService = require(sails.config.appPath + '/api/services/FileService');
var develop = require(sails.config.appPath + '/api/services/develop');
var CommonService = require(sails.config.appPath + '/api/services/common');
const CollectionExcelGeneratorService = require(sails.config.appPath + '/api/services/CollectionExcelGenerator');
const _ = require('lodash');
module.exports = {
    /**
     * @description upload multiple files into specified directories
     * @param req
     * @param res
     */
    async uploadFiles(req, res) {
        let params = req.allParams();
        let headers = req.headers;
        let options = {};

        // apply destination from parameters
        if (params && params.destination) {
            options.destination = params.destination;
            develop.checkDirectorySync
            (`${sails.config.appPath}/assets/images/`, params.destination);
        }

        // apply destination from headers
        if (headers && headers.destination) {
            develop.checkDirectorySync
            (`${sails.config.appPath}/assets/images/`, params.destination);
            options.destination = headers.destination;
        }

        // append attach information
        if (params && params.attachInfo) {
            options.attachInfo = params.attachInfo;
        }
        if (headers && (headers.attachInfo || headers.attachinfo)) {
            options.attachInfo = JSON.parse(headers.attachInfo || headers.attachinfo);
        }
        try {
            let uploadedFiles = [];
            let uploadedFilesErrors = [];
            let streamOptions = await FileService.buildRequest({
                uploadedFiles: uploadedFiles,
                uploadedFilesErrors: uploadedFilesErrors,
                destination: options.destination ?
                    `/images/${options.destination}` : undefined
            });

            req.file('file').upload(FileService.documentReceiverStream(streamOptions), (err, uploaded) => {
                if (err) {
                    throw new Error(err);
                } else {
                    const response = {
                        files: streamOptions.uploadedFiles,
                        errors: streamOptions.uploadedFileErrors,
                        attachInfo: options.attachInfo
                    };
                    return res.ok(response, {
                        message: streamOptions.uploadedFiles.length + ' file uploaded successfully'
                    });
                }
            });
        }
        catch (err) {
            console.log('err', err);
            return res.serverError(null, {message: 'Error.', data: err});
        }
    },

    /**
     * @description:
     * @param req
     * @param res
     */
    async removeFiles(req, res) {
        let params = req.allParams();
        try {
            const isPaths = params && params.paths && params.paths.length;
            if (isPaths) {
                _.forEach(params.paths, async (path) => {
                    if (FileService.getFileSize('assets/' + path) > 0) {
                        let isUnlinkFromAssets = await fs.unlinkSync('assets/' + path);
                    }
                    if (FileService.getFileSize('.tmp/public/' + path) > 0) {
                        let isUnlinkFromTemp = await fs.unlinkSync('.tmp/public/' + path);
                    }
                });
                return res.ok(null, {message: `File${params.paths.length > 1 ? 's' : ''} deleted successfully.`});
            }
            else {
                return res.badRequest(null, sails.config.message.NOT_FOUND);
            }
        }
        catch (err) {
            return res.serverError(null, {message: 'Error.', data: err});
        }
    },
    async importExcel(req, res) {
        let params = req.allParams();
        try {
            let excelUploadPath = '/assets/data/excel/';
            let uploadedFile = await CommonService.storeFile(req, {
                storePath: path.join(sails.config.appPath, excelUploadPath)
            });
            let rows = await CollectionExcelGeneratorService.excelToJson(sails.config.appPath + excelUploadPath + uploadedFile.link);
            // fs.unlinkSync(sails.config.appPath + excelUploadPath + uploadedFile.link);
            let model = sails.models[params.model];
            console.log(model.attributes, model.settings);
            rows = CollectionExcelGeneratorService.formatSheetRecordsToImport(rows, model);
            let log = {
                fileName: uploadedFile.fileName,
                path: sails.config.appPath + excelUploadPath + uploadedFile.link,
                created_by: req.user.id,
                model: params.model,
                stats: {
                    success: 0,
                    failed: 0,
                    updated: 0,
                    created: 0,
                    total: rows.length
                },
                response: {
                    failed: []
                }
            };

            await Promise.all(_.map(rows, async (row, index) => {
                if (!row.id) {
                    try {
                        await model.create(row);
                        log.stats.success += 1;
                        log.stats.created += 1;
                    } catch (e) {
                        log.stats.failed += 1;
                        log.response.failed.push({err: e, rowNumber: index});
                    }
                } else {
                    let recordId = row.id;
                    delete row.id;
                    try {
                        await model.update({id: recordId}, row);
                        log.stats.success += 1;
                        log.stats.updated += 1;
                    } catch (e) {
                        log.stats.failed += 1;
                        log.response.failed.push({err: e, rowNumber: index});
                    }
                }
                return row;
            }));

            await ExcelImportLog.create(log);
            return res.ok({}, {
                message: `File uploaded successfully.</br>Records Stats:</br>Total : <span class=\'badge badge-success\' >${log.stats.total}</span></br>
                <b>Updated</b> : <span class=\'badge bg-primary\' >${log.stats.updated}</span></br>
                <b>Added :</b> <span class=\'badge bg-primary\' >${log.stats.created}</span></br>
                <b>Success :</b> <span class=\'badge bg-primary\' >${log.stats.success}</span></br>
                <b>Failed :</b> <span class=\'badge bg-danger\' >${log.stats.failed}</span></br>`
            });
        } catch (e) {
            console.log('err', e);
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    },
    async exportExcel(req, res) {
        let params = req.allParams();
        if (!params || !params.model) {
            return res.badRequest(null, sails.config.message.BAD_REQUEST);
        }
        let conference_id = req.headers.conference_id;
        try {
            let obj = {};
            obj.Model = params.model;
            obj.conference_id = conference_id;
            if (params.grid) {
                obj.columns = sails.config.services.excelGrid[params.model].columns;
            }
            let response = await CollectionExcelGeneratorService.generateExcelByModel(obj);
            return res.ok(response);
        } catch (e) {
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    }
};

