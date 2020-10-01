module.exports = {

    async paginate(req, res) {
        let params = req.allParams();
        try {
            let filter = {};
            let notifications = await Notification.find(filter).sort('createdAt DESC');
            return res.ok({list: notifications}, sails.config.message.OK)
        } catch (e) {
            return res.serverError(err, sails.config.message.SERVER_ERROR)
        }
    }
}