const sails = require('sails');
module.exports.routes = {
    //Car create..done
    'POST /car/create': {
        controller: 'Car/CarController',
        action: 'create',

    },
    //view ..done
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
    //list by car..done
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
    },
    //update..done
    'PUT /car/:id': {
        controller: 'Car/CarController',
        action: 'update',
        swagger: {
            body: {
                carName: { type: 'string' },
                seater: { type: 'string' },
                color: { type: 'string' },
                engine: { type: 'string' },
                price: { type: 'string' },
                carIdentity: { type: 'string' },
                parentId: { type: 'string' }

            }
        }
    },


}