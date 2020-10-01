module.exports.routes = {
    /* *************** admin user***************************************** */
    'POST /admin/test/create': 'Admin/Common/CommonAPITemplateController.create',
    'POST /admin/test/update': 'Admin/Common/CommonAPITemplateController.update',
    'POST /admin/user/create': 'Admin/UserController.register',
    'POST /admin/user/paginate': 'Admin/UserController.paginate',
    'POST /admin/user/reset-password': 'Admin/UserController.resetPassword',
    'GET /admin/user/:id': 'Admin/UserController.view',
    'PUT /admin/user/:id': 'Admin/UserController.update'
};
