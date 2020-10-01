module.exports.routes = {
    //order create
    'POST /order/create': {
        controller: 'Order/OrderController',
        action: 'create',
    },
    //order view
    'POST /order/:id': {
        controller: 'Order/OrderController',
        action: 'viewOrder',
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

}