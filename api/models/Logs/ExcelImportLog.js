module.exports = {
    tableName: 'ExcelImportLog',
    attributes: {
        fileName: {
            type: 'string'
        },
        path: {
            type: 'string'
        },
        model: {
            type: 'string'
        },
        stats: {
            type: 'json',
            description: {
                success: {
                    type: 'number'
                },
                failed: {
                    type: 'number'
                },
                created: {
                    type: 'number'
                },
                updated: {
                    type: 'number'
                },
            }
        },
        response: {
            type: 'json',
            columnType: 'array',
            description: {
                failed: {
                    type: 'json',
                    columnType: 'array',
                }
            }
        },
        created_by: {
            model: 'User'
        }
    }
};
