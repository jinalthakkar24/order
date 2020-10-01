module.exports.routes = {
    //  ╔═╗╔═╗╦  ╔═╗╔╗╔╔╦╗╔═╗╔═╗╦╔╗╔╔╦╗╔═╗
    //  ╠═╣╠═╝║  ║╣ ║║║ ║║╠═╝║ ║║║║║ ║ ╚═╗
    //  ╩ ╩╩  ╩  ╚═╝╝╚╝═╩╝╩  ╚═╝╩╝╚╝ ╩ ╚═╝
    'POST /auth/login': 'AuthController.login',
    'POST /auth/register': 'AuthController.register',
    'GET /auth/validate_token': 'AuthController.validate_token',
    'GET /auth/logout': 'AuthController.logout',
    'POST /auth/forgot-password': 'AuthController.forgotPassword',
    'POST /auth/check-otp': 'AuthController.checkOtp',
    'POST /auth/reset-password': 'AuthController.resetPassword',
};