const sails = require('sails');
module.exports.routes = {
    //Car

    'POST /car/create': {
        controller: 'Car/CarController',
        action: 'create',

    }

}