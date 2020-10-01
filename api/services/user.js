const _                      = require('lodash');
const UtilService            = require('./util');
const EmailService           = require('./email');
const uuid                   = require('uuid');
const moment                 = require('moment');
const bcrypt                 = require('bcrypt-nodejs');
const CommonService          = require('./common');
module.exports = {
    async update(params) {
        let users = await User.find({});
        let updatedRecords = [];
        try {
            await Promise.all(_.map(users, async (user) => {
                console.log(user);
                let response = await User.update({_id: user.id}, {isDeleted: true});
                updatedRecords.push({id: user.id, result: response});
            }));
        } catch (e) {
            return {error: e, message: 'Failed to update all records'};
        }
        console.log(updatedRecords);
        return updatedRecords;
    },
    async checkDuplication(params) {
        let filter = {where: {}};
        if (params.id) {
            filter.where.id = {'!=': params.id};
        }
        if (params.emails && params.emails.length) {
            filter.where.type = params.type;
            filter.where["emails.email"] = _.map(params.emails, 'email');

            let users = await User.find(filter.where).meta({enableExperimentalDeepTargets: true})
            if (users && users.length > 0) {
                return sails.config.message.EMAIL_REGISTERED
            }
        }
        if (params.mobiles && params.mobiles.length) {
            filter.where.type = params.type;
            filter.where["mobiles.mobile"] = _.map(params.mobiles, 'mobile');

            let users = await User.find(filter.where).meta({enableExperimentalDeepTargets: true})
            if (users && users.length > 0) {
                return sails.config.message.MOBILE_REGISTERED
            }
        }
        return true;
    },
    /**
     * get user filter
     * @param params
     */
    async getFilter(params) {
        let filter = await common.getFilter(params);
        if (params.type) {
            filter.where.type = params.type;
        }
        return filter;
    },
    /**
     * get all users by filter
     * @param filter
     * @returns {Promise.<void>}
     */
    async getUsers(filter) {
        console.log(filter.where);
        filter = await CommonService.gcFilter(filter);
        let countFilter = await CommonService.removePagination(filter);
        return {
            list: await User.find(filter).meta({enableExperimentalDeepTargets: true}),
            count: await User.count(countFilter).meta({enableExperimentalDeepTargets: true})
        };
    },
    /**
     * Send OTP to user  email
     */
    async sendOtpOnMail(options) {
        try {
            let user = options.user;
            // Send OTP to user
            let otp = UtilService.randomNumber();
            let otp_msg = 'Your OTP code is  ' + otp;
            user['verificationCode'] = user['verificationCode'] ? otp : '';

            await User.update({id: user.id}, {verificationCode: otp});
            user.email = _.find(user.emails, {isPrimary: true}).email;
            let mail_obj = {
                subject: 'OTP verification',
                to: user.email,
                template: 'OtpChk',
                data: {
                    name: user.name || '-',
                    email: user.email || '-',
                    message: otp_msg
                }
            };
            EmailService.send(mail_obj);
            return sails.config.message.OK;
        } catch (e) {
            return sails.config.message.SERVER_ERROR;
        }
    },
    async sendMobileVerificationLink(user, mobileNum) {
        try {
            let otp = UtilService.randomNumber();
            let expires = moment();
            expires = expires.add(6, 'hours').toISOString();
            let userMobile = {};
            if (!mobileNum) {
                mobileNum = _.find(user.mobiles, function (m) {
                    return m.isPrimary;
                }).mobile;
            }
            _.each(user.mobiles, function (mobile) {

                if (mobile.mobile === mobileNum) {
                    mobile.verification = {
                        token: otp,
                        expireTime: expires
                    };
                    userMobile = mobile;
                }
            });

            if (!userMobile.isVerified) {
                await User.update({id: user.id}, {mobiles: user.mobiles});
                console.log(otp);
                //TODO :: enable send message for login
                // SMSService.send({
                //     message: "Your Loan Studio verification code is " + otp + ".",
                //     to: userMobile.countryCode + userMobile.mobile
                // });
                return sails.config.message.OK;
            }
            else { //Already verified
                return sails.config.message.OK;
            }
        } catch (e) {
            return sails.config.message.SERVER_ERROR;
        }
    },
    async sendEmailVerificationLink(user, emailId) {
        try {
            let token = uuid();
            let otp_msg = 'Click on the link below to verify your email.';
            let expires = moment();
            expires = expires.add(6, 'hours').toISOString();
            let userEmail = {};
            if (!emailId) {
                emailId = UtilService.getPrimaryEmail(user.emails);
            }
            console.log(emailId);
            _.each(user.emails, function (email) {
                if (email.email === emailId) {
                    email.verification = {
                        token: token,
                        expireTime: expires
                    };
                    userEmail = email;
                }
            });

            if (!userEmail.isVerified) {
                await User.update({id: user.id}, {emails: user.emails});
                let mail_obj = {
                    subject: 'Verify Email',
                    to: userEmail.email,
                    template: 'verifyLink',
                    data: {
                        name: user.name || '-',
                        email: userEmail.email || '-',
                        message: otp_msg,
                        link: UtilService.getBaseUrl() + '/auth/verify-email/' + token,
                        linkText: "Verify Email"
                    }
                };

                EmailService.send(mail_obj);
                return sails.config.message.OK;
            }
            else { //Already verified
                return sails.config.message.OK;
            }
        } catch (e) {
            return sails.config.message.SERVER_ERROR;
        }
    },
    async verifyEmail(params) {
        try {
            let user = await User.findOne({'emails.verification.token': params.token}).meta({enableExperimentalDeepTargets: true});
            if (user) {
                let mainEmail = {};
                _.each(user.emails, (email) => {
                    if (email.verification && email.verification.token && email.verification.token === params.token) {
                        mainEmail = _.clone(email);
                        email.verification = {};
                        email.isVerified = true;
                    }
                });
                if (mainEmail && mainEmail.verification.expireTime) {
                    if (moment().isAfter(moment(mainEmail.verification.expireTime))) {//code expire
                        return sails.config.message.INVALID_VERIFICATION_TOKEN
                    }
                    await User.update({
                        'id': user.id
                    }, {'emails': user.emails});
                    return sails.config.message.EMAIL_VERIFIED
                }
            }
            return sails.config.message.INVALID_VERIFICATION_TOKEN
        } catch (e) {
            console.log(e);
            return sails.config.message.SERVER_ERROR
        }
    },
    async verifyMobile(params) {
        let user = await User.findOne({
            'mobiles.verification.token': params.token,
            'mobiles.mobile': params.mobile
        }).meta({enableExperimentalDeepTargets: true});
        if (user) {
            let mainmobile = {};
            _.each(user.mobiles, (mobile) => {
                if (mobile.verification.token === params.token) {
                    mainmobile = _.clone(mobile);
                    mobile.verification = {};
                    mobile.isVerified = true;
                }
            });
            if (mainmobile && mainmobile.verification.expireTime) {

                if ((moment().isAfter(moment(mainmobile.verification.expireTime)))) {//code expire
                    return sails.config.message.OTP_EXPIRE;
                }
                await User.update({
                    'id': user.id
                }, {'mobiles': user.mobiles});
                return sails.config.message.MOBILE_VERIFIED
            }
            else {//invalid code
                return sails.config.message.INVALID_OTP
            }
        }
        return sails.config.message.INVALID_OTP

    },
    async sendResetPasswordLink(user, type) {
        try {
            let token = uuid();
            let viewType = type && type === 'web' ? "/admin#!/auth/reset-password/" : "/reset-password/";
            let otp_msg = 'Click on the link below to reset your password.';
            let expires = moment();
            expires = expires.add(6, 'hours').toISOString();
            await User.update({id: user.id}, {resetPasswordLink: {code: token, expireTime: expires}});
            user.email = _.find(user.emails, {isPrimary: true}).email;
            let mail_obj = {
                subject: 'Reset Password',
                to: user.email,
                template: 'verifyLink',
                data: {
                    name: user.name || '-',
                    email: user.email || '-',
                    message: otp_msg,
                    link: UtilService.getBaseUrl() + viewType + token,
                    linkText: "Reset Password"
                }
            };
            EmailService.send(mail_obj);
            return true;
        } catch (e) {
            return false;
        }
    },
    async resetUserPassword(user, newPassword) {
        try {
            newPassword = await new Promise((resolve, reject) => {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newPassword, salt, function () {
                    }, function (err, hash) {
                        if (err) {
                            reject(new Error(err));
                        }
                        else {
                            resolve(hash);
                        }
                    });
                });
            });

            await User.update({id: user.id}, {
                password: newPassword,
                resetPasswordLink: null
            });
            user.email = _.find(user.emails, {isPrimary: true}).email;
            let mail_obj = {
                subject: 'Reset Password',
                to: user.email,
                template: 'common',
                data: {
                    name: user.name || '-',
                    email: user.email || '-',
                    message: 'Your password reset successfully.'
                }
            };
            EmailService.send(mail_obj);
            return true;
        } catch (e) {
            return false;
        }
    },
    async changePasswordByAdmin(params) {
        try {
            let password = params.newPassword;
            let user = await User.findOne({
                id: params.id
            });
            if (user && user.id) {
                params.newPassword = await new Promise((resolve, reject) => {
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
                    user.userEmailPass = password;
                    let primaryEmail = _.find(user.emails, {isPrimary: true});
                    user.primaryEmail = primaryEmail && primaryEmail.email ? primaryEmail.email : user.emails[0] && user.emails[0].email ? user.emails[0].email : '';
                    let mail_obj = {
                        subject: 'snapAcleaner- Reset password by admin',
                        to: user.primaryEmail,
                        template: 'adminUserPasswordReset',
                        data: {
                            name: user.name || '-',
                            email: user.primaryEmail || '-',
                            password: user.userEmailPass
                        }
                    };
                    EmailService.send(mail_obj);
                    return user;
                }
                else {
                    return false;
                }
            }
            else {
                return false;
            }
        } catch (e) {
            return false;
        }
    },
    /**
     * if user add or update a service update -> mapData
     * @param options
     * @returns {Promise<boolean>}
     */
    async notificationIdentifierUpsert(options) {
        let deviceType = options.deviceType;
        let playerId = options.playerId;
        let loginUser = options.loginUser;
        try {
            let existedUser = await User.findOne({or: [{androidPlayerId: playerId}, {iosPlayerId: playerId}]});
            //remove key from existed user
            let update = {};
            if (existedUser) {
                if (existedUser.id === loginUser.id) {
                    return sails.config.message.PLAYERID_DUPLICATE;
                }
                let indexOfAndroid = existedUser.androidPlayerId && _.size(existedUser.androidPlayerId) ? existedUser.androidPlayerId.indexOf(playerId) : -1;
                let indexOfIos = existedUser.iosPlayerId && _.size(existedUser.iosPlayerId) ? existedUser.iosPlayerId.indexOf(playerId) : -1;
                if (indexOfAndroid > -1) {
                    update.androidPlayerId = existedUser.androidPlayerId.slice(indexOfAndroid + 1);
                }
                if (indexOfIos > -1) {
                    update.iosPlayerId = existedUser.iosPlayerId.slice(indexOfIos + 1);
                }
                await User.update({id: existedUser.id}, update)
            }
            //update key to new user
            if (deviceType == sails.config.DEVICE_TYPE.ANDROID) {
                if (!loginUser.androidPlayerId) {
                    loginUser.androidPlayerId = [];
                }
                loginUser.androidPlayerId.push(playerId);
                update.androidPlayerId = loginUser.androidPlayerId;
            }
            else {
                if (!loginUser.iosPlayerId) {
                    loginUser.iosPlayerId = [];
                }
                loginUser.iosPlayerId.push(playerId);
                update.iosPlayerId = loginUser.iosPlayerId;
            }

            await User.update({id: loginUser.id}, update);
            return sails.config.message.PLAYERID_SAVED;
        } catch (e) {
            return false;
        }
    },
    async logSocketId(options, callback) {
        try {
            let user = await User.find({
                where: {id: options.userId}, select: ["connectedSockets"]
            }).meta({enableExperimentalDeepTargets: true});
            user = user[0];
            let matched = false;
            let removeIndex = -1;
            if (user.connectedSockets && _.size(user.connectedSockets)) {
                _.each(user.connectedSockets, function (socket, index) {
                    if (socket.deviceId === options.deviceId) {
                        if (options.connect) {
                            socket.socketId = options.socketId;
                            matched = true;
                        }
                        else {
                            removeIndex = index;
                        }
                    }
                });
                console.log('removeIndex', removeIndex);
                if (removeIndex !== -1) {
                    user.connectedSockets.splice(removeIndex, 1)
                }
            }
            else {
                user.connectedSockets = [];
            }
            if (!matched && options.connect) {
                user.connectedSockets.push({
                    socketId: options.socketId,
                    deviceId: options.deviceId
                })
            }
            User
                .update({id: options.userId}, {connectedSockets: user.connectedSockets})
                .exec(callback)
        } catch (e) {
            console.log(e);
            callback(e);
        }
    },
    async getJobsWithoutRatingReview(userId, type) {
        try {
            let completedJobs = await JobRequest.find({
                where: {
                    status: sails.config.JOB_REQUEST.STATUS.COMPLETED,
                    customerId: userId
                },
                select: ['id', 'reqNumber', 'serviceId', 'customerId', 'cleanerId', 'totalCharge']
            }).populate('serviceId').populate('customerId').populate('cleanerId');
            let jobRequestsIds = _.map(completedJobs, 'id');
            let ratings = await Rating.find({jobRequestId: jobRequestsIds});
            let reviews = await Review.find({jobRequestId: jobRequestsIds});
            let result = [];
            _.each(completedJobs, function (job) {
                let givenTo = '';
                if (type === 'cleaner') {
                    if (!job.cleanerId) {
                        return;
                    }
                    givenTo = job.cleanerId.id;
                }
                else {
                    if (!job.customerId) {
                        return;
                    }
                    givenTo = job.customerId.id;
                }
                let rating = _.find(ratings, function (r) {
                    return r.jobRequestId === job.id && r.to === givenTo;
                });
                let review = _.find(reviews, function (r) {
                    return r.jobRequestId === job.id && r.to === givenTo;
                });
                if (!rating && !review) {
                    result.push(job);
                }
            });
            return result;
        } catch (e) {
            throw new Error(e);
        }
    },
    async modifyUserObjectBeforeDbOperation(user) {
        try {
            if (user.firstName || user.lastName) {
                user.name = user.firstName;
                if (user.lastName) {
                    user.name += ' ' + user.lastName;
                }
                user.name = user.name.toLowerCase();
            }
            if (user.emails) {
                _.each(user.emails, function (email) {
                    email.email = email.email.toLowerCase();
                });
            }
            if (user.mobiles) {
                _.each(user.mobiles, function (mobile) {
                    mobile.mobile = mobile.mobile.split(" ").join("");
                });
            }
            console.log(user);
            return user
        } catch (e) {
            throw new Error(e);
        }
    },
    async checkIfUserVerified(user) {
        let emailVerified = false;
        _.each(user.emails, function (email) {
            if (email.isVerified) {
                emailVerified = true;
            }
        });
        return emailVerified;
    }
};