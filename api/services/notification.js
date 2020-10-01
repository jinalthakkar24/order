const OneSignal = require('onesignal-node');

module.exports = {
    async sendPushNotification(options) {
        const myClient = new OneSignal.Client({
            userAuthKey: sails.config.env.onesignal.userAuthKey,
            // note that "app" must have "appAuthKey" and "appId" keys
            app: {
                appAuthKey: sails.config.env.onesignal.appAuthKey,
                appId: sails.config.env.onesignal.appId
            }
        });
        let playerIds = options.playerIds;
        let configObj = {
            contents: {
                en: options.content,
            }
        };
        if (options.data) {
            configObj.data = options.data;
        }
        if (playerIds !== 'all') {//send to specific playerids
            configObj.include_player_ids = playerIds
        } else {//send to all device
            configObj.included_segments = ["All"]
        }
        let notification = new OneSignal.Notification(configObj);

        myClient.sendNotification(notification, function (err, httpResponse, data) {
            if (err) {
                sails.log.error('Something went wrong...');
            } else {
                sails.log.info(data);

            }
        });
    }
};
