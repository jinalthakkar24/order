const faker = require('faker');
const fs = require('fs');
module.exports = {
    seedUsers: async function () {
        let users = [];
        let i;
        for (i = 0; i < 46; i++) {
            let user = {
                "name": faker.name.findName(),
                "username": faker.internet.userName(),
                "email": faker.internet.email(),
                "mobile": faker.phone.phoneNumber(),
                "password": faker.internet.password(),
                "type": "2"
            };
            try {
                await User.create(user);
                users.push(user);
            } catch (e) {
                return {'error': e}
            }
        }
        return {'data': users}
    },
    seedAdminUser: async function () {
        try {
            await User.create({
                "type": 1.0,
                "name": "admin",
                "emails": [
                    {
                        "email": "admin@gmail.com",
                        "isPrimary": true
                    }
                ],
                "firstName": "admin",
                "lastName": "admin",
                "mobiles": [
                    {
                        "mobile": "9978379402",
                        "countryCode": "+91",
                        "isPrimary": true
                    }
                ],
                "dob": "07-12-1993",
                "addresses": [],
                "password": "$2a$10$iqO8PCs9MBsjlZgKbE63i.WeA6ILPPZCdwk5fbfMmUbCHwEXlFd0W",
                "isActive": true,
            });
            console.log('admin user is seeded successfully.');
            return;
        } catch (e) {
            return {'error': e}
        }
    },
    async seedData() {
        try {
            /** we will read like a pro**/
            let files = fs.readdirSync(sails.config.appPath + "/api/seeder-data");
            /** its important that we loop through all files **/
            await Promise.all(_.map(files, async (file) => {
                /** wake models up, its time to seed them **/
                let modelName = file.split('.')[0];
                let Model = sails.models[modelName.toLowerCase()];
                let existingRecords = await Model.find({});
                /** if model already have records why would we seed them, it's stupid**/
                if (existingRecords && _.size(existingRecords) > 0) {
                    return;
                }
                /** read the data before you seed them **/
                let data = JSON.parse(fs.readFileSync(sails.config.appPath + "/api/seeder-data/" + file, 'utf8'));
                /** add each record one after one**/
                await Promise.all(_.map(data, async (record) => {
                    let children;
                    if (record.children) {
                        children = _.clone(record.children);
                        delete record.children;
                    }
                    try {
                        let addedRecord = await Model.create(record).meta({
                            fetch: true,
                            skipAllLifecycleCallbacks: true
                        });
                        /** if has child add them and map parentId key **/
                        if (children && _.size(children) > 0) {
                            await Promise.all(_.map(children, async (r) => {
                                r.parentId = addedRecord.id;
                                try {
                                    await Model.create(r);
                                } catch (e) {
                                    sails.log.error("error while seeding", e);
                                }
                            }));
                        }
                    } catch (e) {
                        sails.log.error("error while seeding", e);
                    }
                }));
                sails.log.debug("Congratulations, we have seeded " + modelName + " model successfully.")
            }));
        } catch (e) {
            sails.log.error("error while seeding", e);
        }
    }
}