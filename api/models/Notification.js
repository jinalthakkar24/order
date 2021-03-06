/**
 * Notification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'Notification',
    attributes: {
        title: {
            type: 'STRING',
            required: true,
        },
        data: {
            type: 'JSON'
        },
        status: {
            type: 'NUMBER',
            required: true,
        }
    }
};

