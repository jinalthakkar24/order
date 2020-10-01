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
            const params = req.allParams();
            var findOrder = await Order.find({ fid: params.id });
            if (findOrder && findOrder.id) {
                var carId = findOrder.carIdentity.id;
                var carData = await Car.find({ cid: carId.id }).populate('carName');
                return res.json(carData);
            }
            else {
                return res.serverError(null, { message: "Failed to display order." })
            }

            console.log("length...", findOrder.length);
            console.log("actual data..", findOrder);

            // return res.json(findOrder);
        }
        catch (err) {
            console.log("error: ", err);
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }



    }
}