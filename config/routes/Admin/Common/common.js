module.exports.routes = {
    'post /admin/common/bulk-boolean-status-update': {
        controller: 'Admin/Common/CommonController',
        action    : 'bulkBooleanStatusUpdate',
        swagger   : {
            summary    : 'Bulk status update  any model',
            description: 'This is for updating status',
            body       : {
                ids   : {type: 'array'},
                status: {
                    type        : 'object',
                    "properties": {
                        "key": {
                            "type": "boolean"
                        }
                    }
                },
                model : {type: 'string'}
            }
        }
    }
};