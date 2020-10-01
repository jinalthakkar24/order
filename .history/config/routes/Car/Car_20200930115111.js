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
                page: {
                    type: 'number',
                    required: true
                },
                limit: {
                    type: 'number',
                    required: true
                },
                search: {
                    type: 'object',
                    'properties': {
                        'keys': {
                            'type': 'array',
                            'items': {
                                type: 'string'
                            }
                        },
                        'keyword': {
                            type: 'string'
                        }
                    }
                },
                isOnlyParents: { type: 'boolean' }
            }
        }
    },
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