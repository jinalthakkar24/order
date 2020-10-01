module.exports = {
    tableName: 'Car',
    friendlyName: 'Car',
    Schema: true,
    attributes: {
        carIdentity: {
            type: 'string'
        },
        carName: {
            model: 'Master'
        },
        seater: {
            model: 'Master'
        },
        color: {
            model: 'Master'
        },
        engine: {
            model: 'Master'
        },
        price: {
            type: 'number'
        },
        //add a reference to order




    }

};