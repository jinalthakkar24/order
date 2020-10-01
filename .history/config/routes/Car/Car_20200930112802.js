const sails = require('sails');
module.exports.routes = {
    //Car create
    'POST /car/create': {
        controller: 'Car/CarController',
        action: 'create',

    },
    //view 
    'POST /car/:id': {
        controller: 'Car/CarController',
        action: 'view',
        swagger: {
            body: {

            }
        }
    },

    //view all cars
    'POST /car/paginate': {
        controller: 'Car/CarController',
        action: 'paginate',
        swagger: {
            body: {

            }
        }
    }

}