var path = require('path');
var moment = require('moment');
var EmailService = require('./email');
var NotificationService = require('./notification');
module.exports = {

    /**
     * @description: getting query builder of locations
     * @param options "{
     *                      "startWith":<Object>,
     *                      "sort":<Object>,
     *                      "project":<Object>,
     *                      "page":<Object>,
     *                      "limit":<Object>,
     *                }"
     * @param callback
     */
    getFilter: async (options) => {
        let filter = {
            where: {
                or: []
            }
        }
        // manage pagination logic
        if (options.page && options.limit) {
            filter.skip = (options.page - 1) * options.limit;
            filter.limit = options.limit;
        }


        // sort by request
        if (options.sort) {
            filter.sort = options.sort;
        }
        else {
            filter.sort = [
                {createdAt: 'DESC'},
                {updatedAt: 'DESC'}
            ]
        }

        if (_.has(options, 'isActive')) {
            filter.where.isActive = options.isActive
        }

        if (_.has(options, 'isDeleted')) {
            filter.where.isDeleted = options.isDeleted
        }

        // filter by start with
        if (options.startWith
            && options.startWith.keys
            && options.startWith.keyword) {
            _.forEach(options.startWith.keys, function (key) {
                if (key) {
                    let orArray = {}
                    orArray[key] = {
                        startsWith: options.startWith.keyword
                    };
                    filter.where.or.push(orArray)
                }
            });
        }

        // NOTE:- keep this filter at end
        if (_.has(options, 'id')) {
            filter = {
                where: {id: options.id}
            }
        }
        // projection by request
        if (options.project) {
            filter.select = options.project;
        }
        if (options.filter) {
            filter.where = _.extend(filter.where, options.filter)
        }

        if (filter.where.or && !filter.where.or.length) {
            delete filter.where.or;
        }

        return filter;
    },
    /**
     * @description GC filter and remove
     * @param filter
     */
    gcFilter: async (filter) => {
        // remove un-necessary or
        if (filter
            && filter.where
            && filter.where.or
            && !filter.where.or.length) {
            delete filter.where.or;
        }
        // remove un-necessary and
        if (filter
            && filter.where
            && filter.where.and
            && !filter.where.and.length) {
            delete filter.where.and;
        }
        return filter;
    },
    /**
     *  update filter with count condition
     * @param filter
     * @returns {Promise.<void>}
     */
    async removePagination(filter) {
        return filter.where;
    },
    /**
     *  convert key of object to lower case
     * @param params : obj
     * @param keys : array
     * @returns {Promise.<*>}
     */
    async convertToLowercase(params, keys) {
        _.each(keys, (k) => {
            if (params[k] && typeof params[k] == "string") params[k] = params[k].toLowerCase()
        })
        return params
    },
    /**
     * store file on given path
     * @param option
     * @returns {Promise.<void>}
     */
    async storeFile(req, option) {
        return await new Promise((resolve, reject) => {
            req.file('file')
                .upload({
                        dirname: option.storePath,
                        maxBytes: option.limit || 1024 * 1024 * 9
                    },
                    function (err, files) {
                        if (err) return reject({err: err, message: 'ERROR.'});
                        else if (files && files.length) {
                            var link = path.basename(files[0].fd);
                            return resolve({link: link})
                        }
                        else {
                            return reject({err: '', message: 'Please select excel file.'});
                        }
                    })
        });
    },
    /**
     *  convert csv to json
     * @param: option{
     * path: <path to store in dir>
     * }
     * @returns {Promise.<*>}
     */
    async convertCsvToJson(option) {
        try {
            const csvFilePath = option.path
            const csv = require('csvtojson')
            return await new Promise((resolve, reject) => {
                let jsonData = []
                csv()
                    .fromFile(csvFilePath)
                    .on('json', (jsonObj) => {
                        jsonData.push(jsonObj)
                    })
                    .on('done', (error) => {
                        resolve({data: jsonData})
                    })
            })
        }
        catch (e) {
            console.log(e)
            throw e
        }
    },
    /**
     * create otp string
     * @param option
     */
    generateOtp(option) {
        // TODO :- uncomment this in production
        //return Math.floor(1000 + Math.random() * 9000);
        return 1234;
    },
    /**
     * @description: getting default sync
     * @param options "{
     *                      "lastSyncDate":<datetime>
     *                }"
     */
    getSyncDateFilter: (options) => {
        let filter = {
            where: {}
        }
        // manage pagination logic
        if (options.page && options.limit) {
            filter.skip = (options.page - 1) * options.limit;
            filter.limit = options.limit;
        }
        // sort by request
        if (options.sort) {
            filter.sort = options.sort;
        }
        // filter by last sync date
        let lastSyncDate = moment(options.lastSyncDate);
        filter["where"].or = [
            {
                createdAt: {
                    ">=": lastSyncDate.toISOString()
                }
            },
            {
                updatedAt: {
                    ">=": lastSyncDate.toISOString()
                }
            }
        ]
        return filter;
    },
    /**
     * Filter for Rap Price and Discount Price API
     * @param options
     * @returns {{where: {or: {}}}}
     */
    /**
     * Format Master and SubMaster according to require format
     * @param masters
     * @returns {{}}
     */
    formatMasters: (masters) => {
        let response = {};
        _.each(masters, function (master, key) {
            response[key] = {};
            _.each(master.subMasters, function (submaster, k) {
                if (key.indexOf('RANGE') !== -1) {
                    response[key][submaster.code] = submaster.name;
                }
                else {
                    response[key][submaster.code] = submaster.id;
                }
            });
        });
        return response
    },
    spliceParamsOnUpdate(data) {
        return _.omit(data, ['id', 'createdAt', 'updatedAt']);
    },
    async sendMailAndPushNotification(options) {
        let mailOptions = options.mail;
        let pushNotificationOptions = options.pushNotification;
        let users = options.users;
        try {
            users = await User.find({where: {id: users}, select: ["emails", "name", "androidPlayerId", "iosPlayerId"]});
            await Promise.all(_.map(users, (user) => {
                let userEmail = _.find(user.emails, function (e) {
                    return e.isPrimary
                });
                let playerIds = [];
                playerIds = playerIds.concat(user.androidPlayerId);
                playerIds = playerIds.concat(user.iosPlayerId);
                let mail_obj = {
                    subject: mailOptions.subject,
                    to: userEmail.email,
                    template: mailOptions.template,
                    data: {
                        name: user.name || '-',
                        email: userEmail.email || '-',
                        message: mailOptions.message
                    }
                };

                //send mail
                EmailService.send(mail_obj);
                //send push notification
                NotificationService.sendPushNotification({
                    playerIds: playerIds,
                    content: pushNotificationOptions.content,
                    data: pushNotificationOptions.data
                });

            }));
            return true;
        } catch (e) {
            console.log(e);
        }
    }
};