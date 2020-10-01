module.exports = {
    tableName: 'Car',
    friendlyName: 'Car',
    Schema: true,
    attributes: {
        carName: {
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
        },


        // fetching masters related to parent
        subMasters: {
            collection: 'Master',
            via: 'carName'
        },

    }

};