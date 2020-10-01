const UserService = require('./user');
module.exports = {
    socketEvents() {
        // sails.io.on('connect', function (socket) {//on connection
        //     socket.on('logSocketId', function (options) {
        //         options.socketId = socket.id;
        //         if (!options || !options.userId || !options.deviceId || !_.has(options, 'connect')) {
        //             socket.emit('errors', {
        //                 flag: false,
        //                 requestName: "logSocketId",
        //                 message: sails.config.message.BAD_REQUEST
        //             });//throw error
        //         } else {
        //             UserService.logSocketId(options, function (err, response) {// update status
        //                 console.log(err, response);
        //                 if (err) {
        //                     socket.emit('errors', {
        //                         flag: false,
        //                         requestName: "logSocketId",
        //                         message: sails.config.message.SERVER_ERROR.message
        //                     });//throw error
        //                 } else {
        //                     socket.emit('success', {
        //                         flag: true,
        //                         requestName: "logSocketId",
        //                         message: "SocketId logged successfully."
        //                     });
        //                 }
        //             });
        //         }
        //     });
        // });
    }
};