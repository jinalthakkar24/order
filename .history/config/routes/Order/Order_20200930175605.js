module.exports.routes = {
    //order create
    'POST /order/create': {
        controller: 'Order/OrderController',
        action: 'create',
    },
    //order view
    'POST /order/:id': {
        contr: 'Order/OrderController',
        action: 'view',
        swagger: {
            body: {

            }
        }
    }
}