module.exports.routes = {
    /************************** ---- DEVICE APIS -------************************************/
    'POST /device/v1/auth/login': 'Device/V1/AuthController.login',
    'POST /device/v1/auth/logout': 'Device/V1/AuthController.logout',
    'POST /device/v1/auth/forgot-password': 'Device/V1/AuthController.forgotPassword',
    'POST /device/v1/auth/check-otp': 'Device/V1/AuthController.checkOtp',
    'POST /device/v1/auth/reset-password': 'Device/V1/AuthController.resetPassword'
};