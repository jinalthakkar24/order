/**
 * Created by CIS1 on 25-02-2015.
 */
const Email = require('email-templates');
const nodemailer = require('nodemailer');
module.exports = {
    send: function (obj, cb) {
        let transport = nodemailer.createTransport({
            service: 'Mailgun',
            auth: {
                user: 'postmaster@smarthumanoid.com',
                pass: 'coruscate01!!'
            }
        });
        const email = new Email({
            message: {
                from: obj.from || 'tarun@smarthumanoid.com'
            },
            send: true,
            transport: transport,
            views: {
                options: {
                    extension: 'ejs' // <---- HERE
                }
            }
        });
        if (!_.isArray(obj.to)) {
            obj.to = [obj.to];
        }
        Promise.all(_.map(obj.to, (emailId) => {
            email
                .send({
                    template: obj.template,
                    message: {
                        to: emailId
                    },
                    locals: obj.data,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
        }));
    }
};


