const sails = require('sails');
module.exports.routes = {
    //Car

    'POST /car/create': {
        controller: 'Car/CarController',
        action: 'create',
        module: config.modules.car,
        operation: config.permission.insert,
        swagger: {
            summary: 'Create Car',
            description: 'This is for creating car',
            body: {
                carName:
            }
        }
    }

}