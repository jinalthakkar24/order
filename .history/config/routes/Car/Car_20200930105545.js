const sails = require('sails');
module.exports.routes = {
    //Car

    'POST /car/create': {
        controller: 'Car/CarController',
        action: 'create',

    },
    //view 
    'POST /car': {
        controller: 'Car/CarController',
        action: 'view',
        swagger: {
            body: {

            }
        }
    }

}