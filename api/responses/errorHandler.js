'use strict';

/**
 * 500 (Internal Server Error) Response
 *
 * A generic error message, given when no more specific message is suitable.
 * The general catch-all error when the server-side throws an exception.
 */

const _ = require('lodash');

module.exports = function (data, config = {}) {
    // console.log('config');
    // console.log(config.code);
    // console.log('----------------');
    let response = sails.config.message.SERVER_ERROR;

    const defaultErrorResponses = sails.config.DEFAULT_ERROR_RESPONSE_CODE;
    const configCode = config.code;

    if (configCode) {
        if (defaultErrorResponses.indexOf(configCode) > -1) {
            response = config;
        } else {
            switch (configCode) {
                case 'E_INVALID_NEW_RECORD':
                    response = sails.config.message.CREATE_FAILED;
                    break;
                case 'E_INVALID_VALUES_TO_SET':
                    // todo change message
                    response = sails.config.message.CREATE_FAILED;
                    break;
                default:
                    response = sails.config.message.SERVER_ERROR;
            }
        }
    }

    let statusCode = config.status || 500;
    this.res.status(statusCode);
    this.res.json(response);
};
