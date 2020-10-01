/**
 * Passport configuration file where you should configure strategies
 */

"use strict";

/**
 * Passport configuration file where you should configure all your strategies
 * @description :: Configuration file where you configure your passport authentication
 */

const _ = require('lodash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcrypt-nodejs');
const EXPIRES_IN_SECONDS = 60 * 24 * 30 * 12 * 60; // 360 days
const SECRET_KEY = "EtU0USaA9KlVjnbWVQSjsR6r0eQdn7DMbGA3rVj8ijTHE9Dm8dS7i2dmP9KjQER";
const ALGORITHM = "HS256";
const Cipher = require('../api/services/cipher');
const RolesService = require('../api/services/roles');

/**
 * @description serialise user information
 */
passport.serializeUser(function (user, done) {
    done(null, user);
});

/**
 * @description de serialize user info
 */
passport.deserializeUser(function (user, done) {
    const filter = {
        where: {id: user.id}
    };

    User
        .findOne(filter,
            (err, user) => {
                if (user) {
                    delete user.password;
                    done(err, user);
                }
                else {
                    done(err, false);
                }
            });
});

/**
 * Configuration object for local strategy
 * @type {Object}
 * @private
 */
const LOCAL_STRATEGY_CONFIG = {
    usernameField: 'username',
    passwordField: 'password',
    session: false,
    passReqToCallback: true
};

/**
 * Configuration object for JWT strategy
 * @type {Object}
 * @private
 */
const JWT_STRATEGY_CONFIG = {
    secretOrKey: SECRET_KEY,
    algorithm: ALGORITHM, // Algorithm for signing
    expiresIn: EXPIRES_IN_SECONDS, // When this token will be expired
    jwtFromRequest: ExtractJwt.versionOneCompatibility({authScheme: 'JWT', tokenBodyField: 'access_token'}),
    tokenQueryParameterName: 'access_token',
    session: false,
    passReqToCallback: true
};


/**
 * Triggers when user authenticates via local strategy
 * @param {Object} req Request object
 * @param {String} email Username from body field in request
 * @param {String} password Password from body field in request
 * @param {Function} next Callback
 * @private
 */
const _onLocalStrategyAuth = async (req, username, password, next) => {
    const filter = {
        where: {
            type: req.options.userType,
            isActive: true,
            or: [
                {"emails.email": username},
                {"mobiles.mobile": username}
            ]
        }
    };
    try {
        let user = await User.findOne(filter).meta({enableExperimentalDeepTargets: true});
        if (!user) return next(null, null, sails.config.message.USER_NOT_FOUND);
        bcrypt.compare(password, user.password, async function (err, res) {
            if (err || !res) {
                return next(null, null, sails.config.message.INVALID_PASSWORD);
            }
            else {
                return next(null, user, {});
            }
        });
    } catch (e) {
        next()
    }
};

/**
 * Triggers when user authenticates via JWT strategy
 * @param {Object} req Request object
 * @param {Object} payload Decoded payload from JWT
 * @param {Function} next Callback
 * @private
 */
const _onJwtStrategyAuth = async (req, payload, next) => {
    try {
        if (payload && payload.user) {
            let user = await User.findOne({id: payload.user.id});
            if (!user) return next(null, null, sails.config.message.USER_NOT_FOUND);
            return next(null, user, {});
        }
        else {
            return next(null);
        }
    } catch (e) {
        next(e)
    }
};

module.exports = {
    passport: {
        /**
         * Triggers when all Passport steps is done and user profile is parsed
         * @param {Object} req Request object
         * @param {Object} res Response object
         * @param {Object} error Object with error info
         * @param {Object} user User object
         * @param {Object} info Information object
         * @returns {*}
         * @private
         */
        async onPassportAuth(req, res, error, user, info) {
            if (error || !user) {
                if (req.body.view) {
                    const payload = {
                        message: (info && info.message ? info.message : 'Login'),
                        _layoutFile: '../login.ejs'
                    }
                    return res.view('login/index', payload);
                }
                else {
                    return res.forbidden(error || user, {message: (info && info.message ? info.message : 'Login')});
                }
                return res.negotiate(error || info);
            }
            if (user) {

                let userPermissions = {};
                if (user.type === sails.config.USER.TYPE.ADMIN) {
                    if (user.roles && user.roles.length) {
                        let permissions = await RolesService.getUserPermission({user: user});
                        if (permissions.data && permissions.data.length) {
                            userPermissions.permissions = permissions.data;
                        }
                    }
                    else {
                        userPermissions.permissions = user.accessPermission || [];
                    }
                }

                // const token = {jwt: cipher('jwt', JWT_STRATEGY_CONFIG).encodeSync({id: user.id})}
                const token = Cipher.createToken(user);
                if (req.body.view) {
                    return res.redirect('/admin');
                }
                else {
                    return res.ok({
                        token: {jwt: token},
                        user: user,
                        userPermissions: userPermissions
                    });
                }

            }
            else {
                return res.notFound(null, sails.config.message.USER_NOT_FOUND);
            }

        }
    }
};

passport.use(new LocalStrategy(_.assign({}, LOCAL_STRATEGY_CONFIG), _onLocalStrategyAuth));
passport.use(new JwtStrategy(_.assign({}, JWT_STRATEGY_CONFIG), _onJwtStrategyAuth));
