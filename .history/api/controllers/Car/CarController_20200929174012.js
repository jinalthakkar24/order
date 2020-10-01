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
    }


    //view car
}