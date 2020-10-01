module.exports = {

    async bulkBooleanStatusUpdate(req, res) {
        let params = req.allParams();

        if (!params || !params.ids || !params.status || !params.model) {
            return res.badRequest(null, sails.config.message.NOT_FOUND);
        }

        try {
            let model          = sails.models[params.model];
            let paramsToUpdate = {};
            _.each(params.status, function (v, k) {
                paramsToUpdate[k] = v;
            });
            let updatedRecord = await model.update({id: params.ids}, paramsToUpdate).fetch();
            return res.ok(updatedRecord, sails.config.message.RECORDS_STATUS_UPDATE)
        } catch (e) {
            return res.serverError(null, {message: "Error.", data: err});
        }
    }

};