module.exports = {
    //create order
    async create(req, res) {
        const params = _.omit(req.allParams(), 'id');
        try {
            let createdOrder = await createdOrder.create(params).fetch();
            if (createdOrder && createdOrder.id) {
                return res.ok(createdOrder, {
                    code: 'OK',
                    message: 'care data updated',
                    status: 200
                })
            }
            else {
                return res.serverError(null, { message: "Failed to create car." })
            }
        }
    }
}