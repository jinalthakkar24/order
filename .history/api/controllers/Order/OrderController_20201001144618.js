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
    async viewOrder(req, res) {
        try {
            const params = req.allParams();
            var findOrder = await Order.find({ id: params.id }).populate('carName');

            var findCarName = await Car.find({ id: findOrder.carIdentity.id.carName });
            console.log("length...", findOrder.length);
            console.log("actual data..", findOrder);

            return res.json(findOrder);
        }
        catch (err) {
            console.log("error: ", err);
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },
    // async viewOrder(req, res) {
    //     try {
    //         const params = req.allParams();
    //         var findOrder = await Order.find({ fid: params.id });
    //         var findCarName = await Car.find({ id: findOrder.carIdentity.id }).populate('carName');
    //         console.log("length....", findCarName.length);
    //         console.log("hello....", findCarName);
    //         return res.json(findCarName);
    //     }
    //     catch (err) {
    //         console.log("error: ", err);
    //         return res.serverError(null, sails.config.message.SERVER_ERROR)
    //     }
    // },

}