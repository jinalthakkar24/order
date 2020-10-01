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
    },
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
    'POST /car/bulk-sequence-update': {
        controller: 'Car/CarController',
        action: 'bulkSequenceUpdate',
        swagger: {
            body: {
                sequences: {
                    'type': 'array',
                    'items': {
                        'type': 'object',
                        'properties': {
                            'id': {
                                'type': 'string'
                            },
                            'sequence': {
                                'type': 'number'
                            }
                        }
                    }
                }
            }
        }
    },

}