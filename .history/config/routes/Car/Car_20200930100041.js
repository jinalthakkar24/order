const sails = require('sails');
module.exports.routes = {
    //Car

    'POST /car/create': {
        controller: 'Car/CarController',
        action: 'create',

    },
    //view 
    'POST /car/list-by-car': {
        controller: 'Car/CarController',
        action: 'listByCar',
        swagger: {
            body: {
                masters: {
                    'type': 'array',
                    'items': {
                        'type': 'string'
                    }
                },
                include: {
                    'type': 'array',
                    'items': {
                        'type': 'string'
                    }
                }
            }
        }
    }

}