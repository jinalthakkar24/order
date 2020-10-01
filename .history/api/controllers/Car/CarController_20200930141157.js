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
                let query = Car.find(filter);

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
            };
            let query = Car.find(filter);

            const masters = await query;
            if (masters && masters.length) {
                let formattedMasters = masterService.formatRecords({
                    masters: masters
                });
                return res.ok(masters, sails.config.message.OK)
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
    async update(req, res) {
        const params = req.allParams();
        try {
            const filter = {
                id: params.id
            };

            let car = await Car.findOne(filter);
            if (car && car.id) {

                let response = await Car.update({ id: car.id }, params).fetch();
                if (response && response.length) {
                    let updatedCar = _.first(response);

                    return res.ok(updatedCar, {
                        code: 'OK',
                        message: 'care data updated',
                        status: 200
                    })
                }
            }
            else {
                return res.serverError(null, { message: "Failed to update car." })
            }
        }
        catch (err) {
            console.log("Err", err);
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },


};