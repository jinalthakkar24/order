module.exports = {
    tableName: 'Car',
    friendlyName: 'Car',
    Schema: true,
    attributes: {
        name: {
            model: 'Master'
        },
        seater: {
            type: 'string'
        },
        color: {
            type: 'string'
        },
        engine: {
            type: 'string'
        },
        price: {
            type: 'number'
        }

    }

};