const request = require('request');
module.exports = {
    getQuotes: function (params) {
        let uri = 'http://quotesondesign.com/wp-json/posts';
        return new Promise((resolve, reject) => {
            request.get({url: uri}, function (error, response, body) {
                if (error) {
                    reject(error)
                } else {
                    resolve(body)
                }
            });
        });
    }
};