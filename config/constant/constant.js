'use strict';

module.exports = {
    DEFAULT_ERROR_RESPONSE_CODE: [
        'E_BAD_REQUEST',
        'E_FORBIDDEN',
        'E_NOT_FOUND',
        'E_UNAUTHORIZED',
        'E_USER_NOT_FOUND',
        'UNPROCESSABLE_ENTITY'
    ],
    SKIP_DEFAULT_FIELD: [
        'createdAt',
        'updatedAt',
        'id'
    ],
    CUSTOM_FIELD_TYPE_FOR_ARRAY: 'fieldType'
};
