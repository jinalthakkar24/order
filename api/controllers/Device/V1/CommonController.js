const fs = require('fs');
module.exports = {
    async downloadFile(req, res) {
        try {
            let params = req.allParams();
            let string = await  fs.readFileSync(sails.config.appPath + '/api/data/discount-price/shape/' + params.fileName);
            res.set('Content-Type', 'application/octet-stream');
            return res.status(200).send(string);
        } catch (e) {
            console.log(e);
            return res.serverError(err, sails.config.message.SERVER_ERROR)
        }
    }
};