const masterService = require(sails.config.appPath + '/api/services/master');
module.exports = {

    //create car
    async create(req, res) {
        const params = _.omit(req.allParams(), 'id');
        try {
            let createdCar = await Car.create(params).fetch();
            if (createdCar && createdCar.id) {
                let message = '';
                message = createdCar && !_.isNull(createdCar.carName) ? sails.config.message.SUB_CAR_CREATED : sails.config.message.CAR_CREATED;
                return res.ok(createdCar, message)
            }
            else {
                return res.serverError(null, { message: "Failed to create car." })
            }
        }
        catch (err) {
            console.log("error: ", err);
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },


    //view car
    async view(req, res) {
        // var findCarName = await Car.find({ carIdentity: 'bln122' }).populate('carName');
        const params = req.allParams();
        var findCarName = await Car.find({ id: params.id }).populate('carName');
        console.log("length....", findCarName.length);
        console.log("hello....", findCarName);
        return res.json(findCarName);
    },

    //list all cars
    async paginate(req, res) {
        const params = _.omit(req.allParams(), 'id');
        try {
            let filter = await masterService.getFilter(params);
            if (filter) {
                let query = Master.find(filter);

                // include references
                if (params.include
                    && params.include.length
                    && _.includes(params.include, sails.config.service.master.INCLUDE.subMasters)) {
                    query = await masterService.includeReferences(params.include, query);
                }
                const masters = await query;
                if (masters && masters.length) {
                    const response = masterService.formatRecords({
                        masters: masters
                    });
                    return res.ok(response, sails.config.message.OK)
                }
                else {
                    return res.ok(null, sails.config.message.NOT_FOUND)
                }
            }
        }
        catch (err) {
            console.log("err", err);
            return res.serverError(err, sails.config.message.SERVER_ERROR)
        }
    },

    //list by car
    async listByCar(req, res) {
        const params = _.omit(req.allParams(), 'id');
        try {
            let filter = {
                where: {
                    code: params.masters,
                    isActive: true
                }
            };
            // filter only parents
            filter = _.assign(filter, masterService.filterParentsOnly(filter));
            let query = Master.find(filter);

            // include references
            if (params.include
                && params.include.length
                && _.includes(params.include, sails.config.service.master.INCLUDE.subMasters)) {
                query = await masterService.includeReferences(params.include, query);
            }
            const masters = await query;
            if (masters && masters.length) {
                let formattedMasters = masterService.formatRecords({
                    masters: masters
                });

                let groupedMastersByCode = {};
                _.forEach(params.masters, (code) => {
                    const findByCode = _.find(formattedMasters, { code: code });
                    if (findByCode) {
                        findByCode.subMasters = _.sortBy(findByCode.subMasters, function (v) {
                            return v.sortingSequence;
                        });
                        if (params.customSort) {
                            findByCode.subMasters = _.sortBy(findByCode.subMasters, function (v) {
                                return parseInt(v.code);
                            });
                        }
                        groupedMastersByCode[code] = findByCode
                    }
                });

                return res.ok(groupedMastersByCode, sails.config.message.OK)
            }
            else {
                return res.notFound(null, sails.config.message.NOT_FOUND)
            }
        }
        catch (err) {
            console.log("err", err);
            return res.serverError(err, sails.config.message.SERVER_ERROR)
        }

    },
    //update
    async PaymentRequestUpdateEvent(req, res) {
        const params = req.allParams();

    }

};