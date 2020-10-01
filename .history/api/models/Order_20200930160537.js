var max = 200, min = 10;
module.exports = {

    tableName: 'Order',
    Schema: true,
    attributes: {
        orderIdentity: {
            type: 'string',

            Math.random() * (max - min) + min
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