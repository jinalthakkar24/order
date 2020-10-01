module.exports = {
    tableName: 'Car',
    friendlyName: 'Car',
    Schema: true,
    attributes: {

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