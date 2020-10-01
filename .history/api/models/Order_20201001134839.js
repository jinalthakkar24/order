var max = 200, min = 10;
var rand = Math.random() * (max - min) + min;
module.exports = {

    tableName: 'Order',
    Schema: true,
    attributes: {
        orderIdentity: {
            type: 'number',
        },
        price: {
            type: 'number'
        },
        status: {
            type: 'boolean'
        },
        //add a reference to car 
        carData: {
            collection: 'car',
            via: 'order'
        }
        // carIdentity: {
        //     model: 'Car'

        // },
    }
}