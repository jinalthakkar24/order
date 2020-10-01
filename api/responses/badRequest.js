'use strict';

/**
 * 400 (Bad Request) Response
 *
 * The request cannot be fulfilled due to bad syntax.
 * General error when fulfilling the request would cause an invalid state.
 * Domain validation errors, missing data, etc.
 */

module.exports = function (data, config) {
    console.log(config);
    console.log('config');
    console.log(data);
    const response = {
        code: _.get(config, 'code', 'E_BAD_REQUEST'),
        message: _.get(config, 'message', 'The request cannot be fulfilled due to bad syntax'),
        data: data || {}
    };

    this.res.status(400);
    this.res.json(response);
};
