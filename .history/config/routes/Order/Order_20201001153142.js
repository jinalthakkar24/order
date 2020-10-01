module.exports.routes = {
    //order create
    'POST /order/create': {
        controller: 'Order/OrderController',
        action: 'create',
    },
    //order view
    'POST /order/:id': {
        controller: 'Order/OrderController',
        action: 'paginateOrder',
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

}