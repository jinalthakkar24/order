/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it
 *     represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

const _ = require('lodash');


module.exports = {
    tableName: 'User',
    friendlyName: 'User',
    schema: true,
    attributes: {
        name: {
            type: 'string'
        },
        firstName: {
            type: 'string',
            required: true,
            unique: true
        },
        userVerification: {
            type: 'json',
            columnType: 'object',
            description: {
                isEmailVerified: {
                    type: 'boolean',
                    required: true
                },
                primaryEmail: {
                    type: 'string',
                    required: true,
                    unique: true
                },
                roles: {
                    type: 'json',
                    columnType: 'array',
                    description: {
                        fieldType: {
                            type: 'string',
                            required: true
                        }
                    }
                },
                emailObj: {
                    type: 'json',
                    columnType: 'object',
                    description: {
                        primaryEmail2: {
                            type: 'string',
                            required: true,
                            unique: true
                        },
                        roles: {
                            type: 'json',
                            columnType: 'array',
                            description: {
                                fieldType: {
                                    type: 'number',
                                    required: true
                                }
                            }
                        },
                        emailSubObj: {
                            type: 'json',
                            columnType: 'object',
                            description: {
                                primaryEmail3: {
                                    type: 'string',
                                    required: true,
                                    unique: true
                                },
                                roles: {
                                    type: 'json',
                                    columnType: 'array',
                                    description: {
                                        fieldType: {
                                            type: 'number',
                                            required: true
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
            }
        },
        emails: {
            type: 'json',
            columnType: 'array',
            description: {
                email: {
                    type: 'string',
                    required: true,
                    unique: true
                },
                isPrimary: {
                    type: 'boolean'
                },
                verification: {
                    type: 'json',
                    columnType: 'object',
                    description: {
                        token: {
                            type: 'string',
                            required: true,
                            unique: true
                        },
                        expireTime: {
                            type: 'datetime'
                        }
                    }
                },
                isVerified: {
                    type: 'boolean'
                }
            }
        },
        mobiles: {
            type: 'json',
            columnType: 'array',
            description: {
                mobile: {
                    type: 'string'
                },
                countryCode: {
                    type: 'string'
                },
                isPrimary: {
                    type: 'boolean'
                },
                verification: {
                    type: 'json',
                    columnType: 'object',
                    description: {
                        token: {
                            type: 'string'
                        },
                        expireTime: {
                            type: 'datetime'
                        }
                    }
                },
                isVerified: {
                    type: 'boolean'
                }
            }
        },
        password: {
            type: 'string'
        },
        type: {
            type: 'number',
            extendedDescription: sails.config.USER.TYPE
        },
        resetPasswordLink: {
            type: 'json',
            description: {
                code: {
                    type: 'string'
                },
                expireTime: {
                    type: 'datetime'
                }
            }
        },
        isDeleted: {
            type: 'boolean',
            defaultsTo: false
        },
        isActive: {
            type: 'boolean',
            defaultsTo: true
        },
        addresses: {
            type: 'json',
            columnType: 'array',
            description: {
                id: {
                    type: 'string'
                },
                name: {
                    type: 'string'
                },
                mobile: {
                    type: 'string'
                },
                isPrimary: {
                    type: 'boolean'
                },
                line1: {
                    type: 'string'
                },
                line2: {
                    type: 'string'
                },
                city: {
                    type: 'string'
                },
                state: {
                    type: 'string'
                },
                country: {
                    type: 'string'
                },
                pincode: {
                    type: 'string'
                },
                /* geo
                 {
                 type:'Point',
                 coordinates:[
                 <float>, // long
                 <float> // lat
                 ]
                 } */
                geo: {
                    type: 'json',
                    columnType: 'object',
                    description: {
                        coordinates: {
                            type: 'json',
                            columnType: 'array',
                            description: {
                                fieldType: {
                                    type: 'float'
                                }
                            }
                        }
                    }
                }
            }
        },
        image: {
            type: 'string',
            allowNull: true
        },
        roles: {
            type: 'json',
            columnType: 'array',
            description: {
                fieldType: {
                    type: 'string'
                }
            }
        },
        accessPermission: {
            type: 'json',
            columnType: 'array',
            description: {
                fieldType: {
                    type: 'object'
                }
            }
        },
        androidPlayerId: {
            type: 'json',
            columnType: 'array',
            defaultsTo: null,
            description: {
                fieldType: {
                    type: 'string'
                }
            }
        },
        iosPlayerId: {
            type: 'json',
            columnType: 'array',
            defaultsTo: null,
            description: {
                fieldType: {
                    type: 'string'
                }
            }
        },
        status: {
            type: 'number'
        },
        connectedSockets: {
            type: 'json',
            columnType: 'array',
            description: {
                fieldType: {
                    type: 'string'
                }
            }
        }
    },
    customToJSON: function () {
        return _.omit(this, ['password']);
    }
};
