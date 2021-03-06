var max = 200, min = 10;
var rand = Math.random() * (max - min) + min;
module.exports = {

    tableName: 'Order',
    Schema: true,
    attributes: {
        orderIdentity: {
            type: 'number',
            unique: rand
        },
        price: {
            type: 'number'
        },
        status: {
            type: 'boolean'
        },
        carIdentity: {
            collection: 'Order'
        },
    }
}