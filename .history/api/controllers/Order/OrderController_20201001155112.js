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
    async paginateOrder(req, res) {
        try {
            const params = _.omit(req.allParams(), 'id');
            var findOrder = await Order.find({ id: params.id });
            console.log("length...", findOrder.length);
            console.log("actual data..", findOrder);
            var carData = findOrder.carIdentity;
            var findCar = await Car.find({ cid: carData }).populate('carName').populate('seater');
            console.log("find car length...", findCar.length);
            console.log("car actual data..", findCar);
            return res.json(findCar);



            // if (findOrder) {
            //     var carData = await Car.find().populate('carName');
            //     console.log("length...", carData.length);
            //     console.log("actual data..", carData);
            //     return res.json(carData);
            // }
            // else {
            //     return res.ok(null, sails.config.message.NOT_FOUND)
            // }

        }
        catch (err) {
            console.log("error: ", err);
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },


}