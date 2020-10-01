module.exports.routes = {
    /************* Notification ************************************/
    'post /admin/file-operator/import-excel': 'Admin/Common/FileOperatorController.importExcel',
    'get /admin/file-operator/export-excel': 'Admin/Common/FileOperatorController.exportExcel',
};