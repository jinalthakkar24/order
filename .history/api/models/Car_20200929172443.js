module.exports = {
    tableName: 'Car',
    friendlyName: 'Car',
    Schema: true,
    attributes: {
        carIdentity: {
            model: 'Master'
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



    }

};