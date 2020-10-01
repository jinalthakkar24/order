/**
 * Master.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */


const deleteSyncService = require(sails.config.appPath + '/api/services/deleteSync');
const masterService = require(sails.config.appPath + '/api/services/master');
module.exports = {
    tableName: 'Master',
    schema: true,
    attributes: {

        name: {
            type: 'STRING'
        },
        normalizeName: {
            type: 'STRING'
            /*defaultsTo: function () {
                return this.name.toLowerCase();
            }*/
        },
        slug: {
            type: 'STRING'
        },
        code: {
            type: 'STRING'
        },
        group: {
            type: 'STRING'
        },
        description: {
            type: 'STRING'
        },

        isActive: {
            type: 'BOOLEAN'
        },
        isDefault: {
            type: 'BOOLEAN'
        },
        sortingSequence: {
            type: 'NUMBER'
        },

        image: {
            type: 'STRING'
        },
        icon: {
            type: 'STRING'
        },

        likeKeyWords: {
            type: 'JSON',
            columnType: 'ARRAY'
        },


        // self relation
        parentId: {
            model: 'Master',
            columnName: 'parentId'
        },

        // fetching masters related to parent
        subMasters: {
            collection: 'Master',
            via: 'parentId'
        },

        isDeleted:{
            type: 'BOOLEAN',
            defaultsTo: false
        }

    },
    /**
     * @description: set default master(s) after create
     * @param masters
     * @param cb
     */
    afterCreate: async (masters, cb) => {
        try {
            await masterService.setDefault(masters);
            return cb()
        } catch (err) {
            return cb(err)
        }
    },

    /**
     * @description: set default master(s) after update
     * @param masters
     * @param: cb
     */
    afterUpdate: async (masters, cb) => {
        try {
            await masterService.setDefault(masters);
            return cb()
        } catch (err) {
            return cb(err)
        }

    },

    afterDestroy: async (masters, cb) => {
        if (masters && masters.length || masters && masters.id) {
            let options = {
                module: Master.identity,
                records: typeof masters === "object" ? [masters] : masters
            };
            await deleteSyncService.logDeletedRecords(options);
            return cb()
        }
        else {
            return cb()
        }


    }
};


