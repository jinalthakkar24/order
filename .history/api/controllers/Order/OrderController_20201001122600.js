const masterService = require(sails.config.appPath + '/api/services/master');
module.exports = {
    //create order
    async create(req, res) {
        const params = _.omit(req.allParams(), 'id');
        try {
            let createdOrder = await Order.create(params).fetch();
            if (createdOrder && createdOrder.id) {
                return res.ok(createdOrder, {
                    code: 'OK',
                    message: 'order created',
                    status: 200
                })
            }
            else {
                return res.serverError(null, { message: "Failed to create order." })
            }
        }
        catch (err) {
            console.log("error: ", err);
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },
    //view order
    async view(req, res) {
        try {
            const params = _.omit(req.allParams(), 'id');
            var findOrder = await Order.find({ id: params.id });

            //let findCarName = await Car.find({ id: findOrder.carIdentity.id }).populate('carName');
            let filter = await masterService.getFilter(findOrder.carIdentity.id);
            if (filter) {
                let query = Master.find(filter).populate('carName');

                const car = await query;
                if (car && car.length) {
                    const response = masterService.formatRecords({ car: car });
                    return res.ok(response, sails.config.message.OK)
                }
                else {
                    return res.ok(null, sails.config.message.NOT_FOUND);
                }
            }
            // console.log("length...", findOrder.length);
            // console.log("actual data..", findOrder);

            //return res.json(findOrder);
        }
        catch (err) {
            console.log("error: ", err);
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },

}