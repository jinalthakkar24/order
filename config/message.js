'use strict';

/**
 * Configuration file where you can store error codes for responses
 *
 * It's just a storage where you can define your custom API errors and their description.
 * You can call then in your action res.ok(data, sails.config.errors.USER_NOT_FOUND);
 */

module.exports = {
    message: {
        BAD_REQUEST: {
            code: 'E_BAD_REQUEST',
            message: 'The request cannot be fulfilled due to bad syntax',
            status: 400
        },
        CREATED: {
            code: 'CREATED',
            message: 'The request has been fulfilled and resulted in a new resource being created',
            status: 201
        },
        CREATE_FAILED: {
            code: 'CREATE_FAILED',
            message: 'The request has not been fulfilled, Please try again',
            status: 500
        },
        IS_REQUIRED: {
            message: 'is required.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        IS_DUPLICATE: {
            message: 'already exists.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        REQUIRED_FIELD_MISSING: {
            message: 'Required field missing.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        REQUIRED_MODEL_NAME: {
            message: 'Model name is required.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        CREATE_FAILED_WITH_ID: {
            message: 'Can not create record with id.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        INVALID_FIELD: {
            message: ': field not exists.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        INVALID_FIELD_TYPE: {
            message: ' must be type of ',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        REQUIRED_MODEL_TYPE: {
            message: ' : Type missing in model.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        REQUIRED_MODEL_COLUMN_TYPE: {
            message: ' : Column Type missing in model.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        REQUIRED_MODEL_DESCRIPTION: {
            message: ' : Description missing in model.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        INVALID_MODEL_NAME: {
            message: 'Invalid model.',
            code: 'UNPROCESSABLE_ENTITY',
            status: 422
        },
        FORBIDDEN: {
            code: 'E_FORBIDDEN',
            message: 'User not authorized to perform the operation',
            status: 403
        },
        NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'The requested resource could not be found but may be available again in the future',
            status: 404
        },
        OK: {
            code: 'OK',
            message: 'Operation is successfully executed',
            status: 200
        },
        LOGOUT: {
            code: 'OK',
            message: 'Successfully logout.',
            status: 200
        },
        SERVER_ERROR: {
            code: 'E_INTERNAL_SERVER_ERROR',
            message: 'Something bad happened on the server',
            status: 500
        },
        UNAUTHORIZED: {
            code: 'E_UNAUTHORIZED',
            message: 'Missing or invalid authentication token',
            status: 401
        },
        USER_NOT_FOUND: {
            code: 'E_USER_NOT_FOUND',
            message: 'User with specified credentials is not found',
            status: 401
        },
        USER_REGISTERED: {
            code: 'OK',
            message: 'User registered successfully.',
            status: 200
        },
        USER_UPDATED: {
            code: 'OK',
            message: 'User updated successfully.',
            status: 200
        },
        RECORD_UPDATED: {
            code: 'OK',
            message: 'Record updated successfully.',
            status: 200
        },
        RECORD_NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'Record not found with specified id.',
            status: 404
        },
        EMAIL_REGISTERED: {
            code: 'E_DUPLICATE',
            message: 'Email already registered.',
            status: 200
        },
        MOBILE_REGISTERED: {
            code: 'E_DUPLICATE',
            message: 'Mobile already registered.',
            status: 200
        },
        USERNAME_REGISTERED: {
            code: 'E_DUPLICATE',
            message: 'Username already registered.',
            status: 200
        },
        USER_REGISTER_FAILED: {
            code: 'E_INTERNAL_SERVER_ERROR',
            message: ' Failed to registered user.',
            status: 401
        },
        LOGIN: {
            code: 'OK',
            message: 'Successfully login.',
            status: 200
        },
        INVALID_USERNAME: {
            code: 'E_BAD_REQUEST',
            message: 'Invalid username.',
            status: 401
        },
        INVALID_PASSWORD: {
            code: 'E_BAD_REQUEST',
            message: 'Invalid password.',
            status: 401
        },
        INVALID_TOKEN: {
            code: 'E_BAD_REQUEST',
            message: 'Invalid token.',
            status: 401
        },
        INVALID_OTP: {
            code: 'E_BAD_REQUEST',
            message: 'Invalid OTP.',
            status: 401
        },
        USER_LIST_NOT_FOUND: {
            code: 'E_NOT_FOUND',
            message: 'User not found.',
            status: 404
        },
        USER_DELETED: {
            code: 'OK',
            message: 'User(s) deleted successfully.',
            status: 200
        },
        USER_PASSWORD_RESET: {
            code: 'OK',
            message: 'Password reset successfully.',
            status: 200
        },
        USER_OTP_SENT: {
            code: 'OK',
            message: 'Password reset otp sent successfully.',
            status: 200
        },
        RESET_PASSWORD_LINK_EXPIRE: {
            code: 'E_BAD_REQUEST',
            message: 'Your reset password link is expired on invalid',
            status: 401
        },
        OTP_EXPIRE: {
            code: 'E_BAD_REQUEST',
            message: 'Your OTP has expires.',
            status: 401
        },
        // MASTER
        NAME_ALREADY_EXISTS: {
            code: 'E_DUPLICATE',
            message: 'Name / Code already registered, please try another',
            status: 200
        },
        SET_IN_ACTIVE_MASTER_AS_DEFAULT: {
            code: 'E_SET_IN_ACTIVE_MASTER_AS_DEFAULT',
            message: 'Inactive master can not be set as default. Please active it first.',
            status: 200
        },
        MASTER_CREATED: {
            code: 'OK',
            message: 'Master created successfully.',
            status: 200
        },
        SUB_MASTER_CREATED: {
            code: 'OK',
            message: 'Sub Master created successfully.',
            status: 200
        },
        SUB_MASTER_UPDATED: {
            code: 'OK',
            message: 'Sub Master updated successfully.',
            status: 200
        },
        MASTER_UPDATED: {
            code: 'OK',
            message: 'Master updated successfully.',
            status: 200
        },
        MASTER_DELETED: {
            code: 'OK',
            message: 'Master(s) deleted successfully.',
            status: 200
        },
        MASTER_DELETE_DEP: {
            code: 'E_DELETE_DEP',
            message: 'The master exists in sub masters.please remove it first',
            status: 401
        }
    }
};
