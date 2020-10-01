/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var auth = require(sails.config.appPath + '/api/services/auth');
const config = require(sails.config.appPath + '/config/constant/user');
const CommonService = require(sails.config.appPath + '/api/services/common');
const UserService = require(sails.config.appPath + '/api/services/user');
const SMSService = require(sails.config.appPath + '/api/services/sms');
const moment = require('moment');
module.exports = {
    /**
     * register user
     * @param req
     * @param res
     * @returns {Promise.<*>}
     */
    register: async function (req, res) {
        let params = req.allParams();
        let option = {
            params: params
        };
        try {
            let createdUser = await auth.register(option);
            if (createdUser) {
                return res.ok(createdUser, sails.config.message.USER_REGISTERED);
            } else {
                return res.ok(createdUser, sails.config.message.USER_REGISTER_FAILED);
            }
        }
        catch (err) {
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    },

    /**
     * login
     * @param req
     * @param res
     */
    login: function (req, res) {
        req.options.userType = [sails.config.USER.TYPE.SUPER_ADMIN, sails.config.USER.TYPE.ADMIN];
        auth.login(req, res);
    },

    /**
     * validate token
     * @param req
     * @param res
     */
    validate_token: function (req, res) {
        auth.isvalidtoken(req, res);
    },

    /**
     * logout
     * @param req
     * @param res
     * @returns {*}
     */
    logout: function (req, res) {
        try {
            auth.logout(req);
            //req.logout is passportjs function to clear user information. see http://passportjs.org/docs
            return res.ok(null, sails.config.message.LOGOUT);
        }
        catch (err) {
            console.log(err);
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    },

    /**
     * @desc : change password
     * @param req
     * {
     *   "id":"",
     *   "oldPassword":"",
     *   "newPassword":""
     * }
     * @param res
     * @returns {Promise.<*>}
     */
    async resetPassword(req, res) {
        const params = req.allParams();
        try {

            if (!params || !params.newPassword || !params.token) {
                return res.badRequest(null, sails.config.message.BAD_REQUEST);
            }
            let user = await User.findOne({'resetPasswordLink.code': params.token}).meta({enableExperimentalDeepTargets: true});
            if (user && user.resetPasswordLink.expireTime) {
                if (moment().isAfter(moment(user.resetPasswordLink.expireTime))) {//link expire
                    return res.ok(false, sails.config.message.RESET_PASSWORD_LINK_EXPIRE);
                }
            } else {//invalid token
                return res.ok(false, sails.config.message.RESET_PASSWORD_LINK_EXPIRE);
            }
            let response = await UserService.resetUserPassword(user, params.newPassword);
            if (response) {
                return res.ok({}, sails.config.message.USER_PASSWORD_RESET);
            } else {
                return res.serverError(null, sails.config.message.SERVER_ERROR);
            }
        }
        catch (err) {
            console.log(err);
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    },

    /**
     * @desc : send forgot password otp
     * @param req
     * {
     *   "id":"",
     *   "oldPassword":"",
     *   "newPassword":""
     * }
     * @param res
     * @returns {Promise.<*>}
     */
    async forgotPassword(req, res) {
        const params = req.allParams();
        try {

            if (!await auth.validateForgotPasswordParams(params)) {
                return res.badRequest(null, sails.config.message.BAD_REQUEST);
            }

            let user = await User.findOne({'emails.email': params.username}).meta({enableExperimentalDeepTargets: true});
            if (user) {
                let message = await UserService.sendResetPasswordLink(user, 'web');
                if (message) {
                    return res.ok(null, message);
                } else {
                    return res.serverError(null, sails.config.message.SERVER_ERROR);
                }
            } else {
                return res.notFound(null, sails.config.message.USER_LIST_NOT_FOUND);
            }
        }
        catch (err) {
            console.log(err);
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    },

    /**
     * check otp of user
     * @param req
     * @param res
     * @returns {Promise.<*>}
     */
    async checkOtp(req, res) {
        const params = req.allParams();
        try {
            if (!await auth.validateCheckOtpParams(params)) {
                return res.badRequest(null, sails.config.errors.BAD_REQUEST);
            }

            let user = await User.findOne({'resetPasswordLink.code': params.code}).meta({enableExperimentalDeepTargets: true});
            if (user && user.resetPasswordLink.expireTime) {
                if (moment().isAfter(moment(user.resetPasswordLink.expireTime))) {//code expire
                    return res.ok(false, sails.config.errors.OTP_EXPIRE);
                }
                User.update({
                    'mobiles.mobile': params.mobile,
                    'resetPasswordLink.code': params.code
                }, {resetPasswordLink: null});
                return res.ok({}, sails.config.errors.OK);
            } else {//invalid code
                return res.ok(false, sails.config.errors.INVALID_OTP);
            }
        }
        catch (err) {
            console.log(err);
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    },
    async sendOtp(req, res) {
        const params = req.allParams();
        try {
            if (!await auth.validateForgotPasswordParams(params)) {
                return res.badRequest(null, sails.config.message.BAD_REQUEST);
            }
            let user = await User.findOne({
                or: [
                    {'mobiles.mobile': params.mobile},
                ]
            }).meta({enableExperimentalDeepTargets: true});
            if (user) {
                let response = await UserService.sendOtp(user);
                return res.ok({}, response);
            }
            else {
                return res.notFound(null, sails.config.message.USER_LIST_NOT_FOUND);
            }
        }
        catch (err) {
            console.log(err);
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    },
    async verifyEmail(req, res) {
        const params = req.allParams();
        if (!params || !params.token) {
            return res.badRequest(null, sails.config.message.BAD_REQUEST);
        }
        try {
            let response = await UserService.verifyEmail(params);
            return res.view('message', {
                message: response.message,
                _layoutFile: ''
            });
        } catch (err) {
            return res.view('message', {
                message: 'Something went wrong.',
                _layoutFile: ''
            });
        }
    },
    async verifyMobile(req, res) {
        const params = req.allParams();
        if (!params || !params.token || !params.mobile) {
            return res.badRequest(null, sails.config.message.BAD_REQUEST);
        }
        try {
            let response = await UserService.verifyMobile(params);
            return res.ok({}, response);
        } catch (err) {
            return res.serverError(null, sails.config.message.SERVER_ERROR);
        }
    }
};
