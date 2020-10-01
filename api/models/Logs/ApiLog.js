/**
 * Admin/LoginLog.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'ApiLog',
    schema: true,
    attributes: {
        userId: {
            model: 'User'
        },
        url: {
            type: 'string'
        },
        // constant 1) elvee api 2) third party api
        type: {
            type: 'number'
        },
        moduleType: {
            type: 'number'
        },
        responseStatusCode: {
            type: 'string'
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
        }
    }
};


