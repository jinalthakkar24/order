"use strict";
const _ = require('lodash');
module.exports = {

    /**
     * @description generate slug from string
     * @param text
     * @return {string}
     */
    slugify: (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');
    },


    /**
     * @description: humanize string into readable format
     * @param str
     */
    humanize: (str) => {
        return str
            .replace(/^[\s_]+|[\s_]+$/g, '')
            .replace(/[_\s]+/g, ' ')
            .replace(/^[a-z]/, function (m) {
                return m.toUpperCase();
            });
    },
    /**
     * Merge multiple objects into one
     * @param roles
     * @returns {*}
     */
    mergeObjects: function (roles) {

        // Custom merge function ORs together non-object values, recursively
        // calls itself on Objects.
        let merger = function (a, b) {
            if (_.isObject(a)) {
                return _.merge({}, a, b, merger);
            } else {
                return a || b;
            }
        };

        // Allow roles to be passed to _.merge as an array of arbitrary length
        let args = _.flatten([{}, roles, merger]);
        return _.merge.apply(_, args);
    },
    /**
     * @description getting base URL of project
     * @return {string}
     */
    getBaseUrl: () => {
        var usingSSL = sails.config.ssl && sails.config.ssl.key && sails.config.ssl.cert;
        var port = sails.config.proxyPort || sails.config.port;
        var localAppURL =
            (usingSSL ? 'https' : 'http') + '://' +
            (sails.config.explicitHost || 'localhost') +
            (port == 80 || port == 443 ? '' : ':' + port);

        return localAppURL;
    },
    randomNumber: (length = 6) => {
        let numbers = '01234567890123456789';
        let result = '';
        for (let i = length; i > 0; --i) {
            result += numbers[Math.round(Math.random() * (numbers.length - 1))];
        }
        return result;
    },
    getPrimaryEmail(emails) {
        if (emails && _.size(emails) > 0) {
            let email = _.find(emails, function (email) {
                return email.isPrimary;
            })
            return email && email.email ? email.email : '';
        }
        return '';
    },
};
