/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var auth = require(sails.config.appPath + '/api/services/auth');
var CommonService = require(sails.config.appPath + '/api/services/common');
var config = require(sails.config.appPath + '/config/constant/user');
const authService = require(sails.config.appPath + '/api/services/auth');
const _ = require("lodash");
const bcrypt = require('bcrypt-nodejs');

module.exports = {

    /**
     * login
     * @param req
     * @param res
     */
    login: function (req, res) {
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
            authService.logout(req)
            //req.logout is passportjs function to clear user information. see http://passportjs.org/docs
            return res.ok(null, sails.config.message.LOGOUT);
        }
        catch (err) {
            console.log(err)
            return res.serverError(null, sails.config.message.SERVER_ERROR)
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

            if (!await authService.validateResetPasswordParams(params)) {
                return res.badRequest(null, sails.config.message.BAD_REQUEST)
            }
            params.newPassword = await  new Promise((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(params.newPassword, salt, function () {
                    }, function (err, hash) {
                        if (err) {
                            reject(new Error(err))
                        }
                        else {
                            resolve(hash)
                        }
                    });
                });
            });

            let updatedUser = await User.update({id: params.id}, {
                password: params.newPassword,
                verificationCode: undefined
            }).fetch();
            if (updatedUser && updatedUser.length) {
                return res.ok(_.pick(updatedUser[0], ['id', 'type', 'name', 'userName']), sails.config.message.USER_PASSWORD_RESET)
            }
            else {
                return res.notFound({}, sails.config.message.USER_LIST_NOT_FOUND)
            }
        }
        catch (err) {
            console.log(err)
            return res.serverError(null, sails.config.message.SERVER_ERROR)
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

            if (!await authService.validateForgotPasswordParams(params)) {
                return res.badRequest(null, sails.config.message.BAD_REQUEST)
            }

            let user = await User.findOne({
                or: [
                    {username: params.username},
                    {email: params.username},
                    {mobile: params.username},
                ],
                type: config.service.user.TYPE.DEVICE
            });
            if (user) {
                let updatedUser = await User.update({id: user.id}, {verificationCode: CommonService.generateOtp({})}).fetch();
                if (updatedUser && updatedUser.length) {
                    return res.ok(_.pick(user, ['id', 'type', 'name', 'userName']), sails.config.message.USER_OTP_SENT)
                }
                else {
                    return res.notFound({}, sails.config.message.USER_LIST_NOT_FOUND)
                }
            }
            else {
                return res.notFound(null, sails.config.message.USER_LIST_NOT_FOUND)
            }
        }
        catch (err) {
            console.log(err)
            return res.serverError(null, sails.config.message.SERVER_ERROR)
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
            if (!await authService.validateCheckOtpParams(params)) {
                return res.badRequest(null, sails.config.message.BAD_REQUEST)
            }
            let user = await authService.checkOtp(params)
            if (user) return res.ok(_.pick(user, ['id', 'type', 'name', 'userName']), sails.config.message.OK)
            else return res.notFound({}, sails.config.message.USER_LIST_NOT_FOUND)
        }
        catch (err) {
            console.log(err)
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    }
};
