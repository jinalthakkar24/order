module.exports.routes = {
    //order create
    'POST /order/create': {
        controller: 'Order/OrderController',
        action: 'create',
    },
    //order view
    'POST /order/:id': {
        controller: 'Order/OrderController',
        action: 'view',
        swagger: {
            body: {

            }
        }
    },
    'POST /order/:id': {
        controller: 'Order/OrderController',
        action: 'viewCar',
        swagger: {
            body: {

            }
        }
    }
}