'use strict';

/**
 * 422 (Invalid Request) Response
 *
 * The request cannot be fulfilled due to validation error.
 * General error when fulfilling the request would cause an invalid state.
 * Domain validation errors, missing data, etc.
 */

module.exports = function (data, errorMessage) {
    if (errorMessage) {
        const statusCode = 422;
        const response = {
            code: 'UNPROCESSABLE_ENTITY',
            message: errorMessage,
            status: statusCode
        };
        this.res.status(statusCode);
        this.res.json(response);
    } else {
        this.res.serverError();
    }
};
