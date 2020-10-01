let DeleteDependencyService = require(sails.config.appPath + '/api/services/DeleteDependencyService');
const DELETE_DEPENDENCY     = require(sails.config.appPath + '/config/constant/deleteDependency').services;
const async                 = require('async');
module.exports              = {
    /**
     * Get Dependencies for destroy parent
     * @param req
     * @param res
     */
    getForeignDependencies: function (req, res) {
        // let self = this;
        let params = req.allParams();

        if (!params || !params.model || !params.documentId) {
            return res.badRequest(null, sails.config.message.NOT_FOUND);
        }
        let dependencies = [];
        if (!_.isArray(params.documentId)) {
            params.documentId = [params.documentId];
        }
        async.each(params.documentId, (documentId, ecb) => {
            let records = [{documentId: documentId, 'model': params.model}];
            sails.models[params.model].findOne({id: documentId}, (err, record) => {
                let title = '';
                if (DELETE_DEPENDENCY.DependenciesColumns[params.model] && record[DELETE_DEPENDENCY.DependenciesColumns[params.model][0]]) {
                    title = record[DELETE_DEPENDENCY.DependenciesColumns[params.model][0]];
                }
                DeleteDependencyService.loopThroughDependencies(records, [], function (dep) {
                    dependencies.push({dependents: dep, title: title, id: documentId});
                    ecb(null, dependencies);
                });
            });
        }, (err) => {
            if (err) {
                return res.serverError(null, {message: "Error.", data: err});
            }
            return res.ok({list: dependencies}, 'success');
        });
    },
    /**
     * Get Model records with data for delete dependency
     * @param req
     * @param res
     */
    getModelRecords       : function (req, res) {
        let params = req.allParams();

        if (!params || !params.model || !params.documentId || !params.dependentModel) {
            return res.toJson(false, [], 'This request is not valid , Please try again !.');
        }

        DeleteDependencyService
            .resolveDependentRecordsWithData({
                documentId    : params.documentId,
                model         : params.model,
                dependentModel: params.dependentModel,
                idsArr        : params.idsArr || []
            }, function (err, result) {
                if (err) return res.ok(false, err, "ERROR.");
                if (result && result.length > 0) {
                    return res.ok(result, 'success')
                }
                else {
                    return res.notFound({})
                }
            });
    },
    async softDeleteRecord(req, res) {
        let params = req.allParams();
        if (!params || !params.model || !params.ids) {
            return res.badRequest(null, sails.config.message.NOT_FOUND);
        }
        try {
            await sails.models[params.model].update({id: params.ids}, {isDeleted: true});
            if (!_.isArray(params.ids)) {
                params.ids = [params.ids];
            }
            return res.ok(params.ids, sails.config.message.RECORDS_DELETED);
        } catch (e) {
            return res.serverError(null, {message: "Error.", data: e});
        }
    },
    /**
     * remove all records based on record id
     * @param req
     * @param res
     * @returns {Promise.<*>}
     */
    async bulkDestroy(req, res) {
        try {
            const params = req.allParams();
            if (!params || !params.ids || !params.model) {
                return res.badRequest(null, sails.config.message.BAD_REQUEST);
            }
            else {
                let model = sails.models[params.model];
                await model.destroy({id: params.ids}).fetch();
                if (_.size(params.ids) === 1) {
                    return res.ok(params.ids, sails.config.message.RECORD_DELETED)
                }
                else {
                    return res.ok(params.ids, sails.config.message.RECORDS_DELETED)
                }
            }
        }
        catch (err) {
            console.log("err", err)
        }
    }
};
