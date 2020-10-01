/**
 * Admin/LoginLog.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'LoginLog',
    schema: true,
    attributes: {
        userId: {
            model: 'User'
        },
        host: {
            type: 'string'
        },
        ip: {
            type: 'string'
        },
        userAgent: {
            type: 'string'
        },
        from: {
            type: 'number'
        },
        // location information of user
        locationInformation: {
            type: 'json'
        },
        token: {
            type: 'string'
        },
        status: {
            type: 'number',
            description: 'type:number constant 1) Active 2) Deactive 3) Rejected'
        }
    }
};

