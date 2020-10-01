module.exports = {
    tableName: 'Order',
    Schema: true,
    attributes: {
        orderIdentity: {
            type: 'string',

        },
        price: {
            type: 'number'
        },
        status: {
            type: 'boolean'
        },
        carId: {
            type: 'Car'
        },
    }
}