const dataSotre=require('../../config/datastores');

"use strict";

/**
 * Test environment settings
 * @description :: This section overrides all other config values ONLY in test environment
 */

module.exports = {
    log: {
        level: 'info'
    },
    models: {
        connection: 'default'
    },
    port: 13700,
   // appPath: '../'
    /* policies: {
     '*': true
     },
     hooks: {
     csrf: false,
     grunt: false,
     i18n: false,
     pubsub: false,
     session: false,
     sockets: false,
     views: false
     }*/
};
