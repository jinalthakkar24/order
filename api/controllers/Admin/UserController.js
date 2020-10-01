/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const userService = require(sails.config.appPath + '/api/services/user');
const authService = require(sails.config.appPath + '/api/services/auth');
const _ = require("lodash");
const bcrypt = require('bcrypt-nodejs');
module.exports = {
    /**
     * create user with unique params
     * @param req
     * @param res
     * @returns {Promise.<*>}
     */
    async register(req, res) {
        let params = req.allParams();
        let option = {
            params: params
        }
        try {
            // required params check
            if (!await authService.requiredParamsForRegister(params)) return res.badRequest(null, sails.config.message.BAD_REQUEST)
            // duplicate
            if (await authService.checkDuplication(params, 'email')) return res.badRequest(null, sails.config.message.EMAIL_REGISTERED)
            if (await authService.checkDuplication(params, 'mobile')) return res.badRequest(null, sails.config.message.MOBILE_REGISTERED)
            if (await authService.checkDuplication(params, 'username')) return res.badRequest(null, sails.config.message.USERNAME_REGISTERED)
            // create user
            let createdUser = await authService.register(option);
            if (createdUser) return res.ok(createdUser, sails.config.message.USER_REGISTERED)
            else return res.serverError({}, sails.config.message.USER_REGISTER_FAILED)
        }
        catch (err) {
            console.log(err)
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },

    /**
     *  user list
     * @param req
     * @param res
     * @returns {Promise.<*>}
     */
    async paginate(req, res) {
        let params = req.allParams();
        try {
            // get filter
            let filter = await userService.getFilter(params);
            // det user
            let users = await userService.getUsers(filter);
            if (users && users.list && users.list.length) return res.ok(users, sails.config.message.OK)
            else return res.ok({}, sails.config.message.USER_LIST_NOT_FOUND)
        }
        catch (err) {
            console.log(err)
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },

    /**
     *  user view
     * @param req
     * @param res
     * @returns {Promise.<*>}
     */
    async view(req, res) {
        let params = req.allParams();
        try {
            // get filter
            if (!params.id) return res.badRequest(null, sails.config.message.BAD_REQUEST)
            // create user
            let users = await User.findOne({id: params.id});
            if (users) return res.ok(users, sails.config.message.OK)
            else return res.notFound({}, sails.config.message.USER_LIST_NOT_FOUND)
        }
        catch (err) {
            console.log(err)
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    },

    /**
     *  user list
     * @param req
     * @param res
     * @returns {Promise.<*>}
     */
    async update(req, res) {
        let params = req.allParams();
        try {
            // get filter
            if (!params.id) return res.badRequest(null, sails.config.message.BAD_REQUEST)
            // duplicate
            if (params.email && await authService.checkDuplication(params, 'email')) return res.badRequest(null, sails.config.message.EMAIL_REGISTERED)
            if (params.mobile && await authService.checkDuplication(params, 'mobile')) return res.badRequest(null, sails.config.message.MOBILE_REGISTERED)
            if (params.username && await authService.checkDuplication(params, 'username')) return res.badRequest(null, sails.config.message.USERNAME_REGISTERED)

            // create user
            /*let user = await User.findOne({id: params.id});
            if (!user) return res.notFound({}, sails.config.message.USER_LIST_NOT_FOUND)*/
            let user = _.omit(params, 'id')
            let updatedUser = await User.update({id: params.id}).set(user).fetch()
            if (updatedUser) return res.ok(updatedUser, sails.config.message.USER_UPDATED)
            else return res.notFound({}, sails.config.message.USER_LIST_NOT_FOUND)
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

            let user = await User.findOne({
                id: params.id
            });
            if (user && user.id) {


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

                let updatedUser = await User.update({id: user.id}, {password: params.newPassword}).fetch();
                if (updatedUser && updatedUser.length) {
                    return res.ok(_.pick(user, ['id', 'type', 'name', 'userName']), sails.config.message.USER_PASSWORD_RESET)
                }
                else {
                    return res.notFound({}, sails.config.message.USER_LIST_NOT_FOUND)
                }
            }
            else {
                return res.notFound(null, sails.config.message.NOT_FOUND)
            }
        }
        catch (err) {
            return res.serverError(null, sails.config.message.SERVER_ERROR)
        }
    }

};
