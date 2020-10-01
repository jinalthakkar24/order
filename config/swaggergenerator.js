module.exports["swagger"] = {
    swaggerJsonPath: "./assets/swagger.json",
    parameters: { //we can add up custom parameters here
        TokenHeaderParam: {
            in: 'header',
            name: 'Authorization',
            required: false,
            type: 'string',
            description: "For device api please send device token with prefix JWT . EX:- JWT <your token>"
        }
    },
    disabled: true,
    swagger: {
        swagger: '2.0',
        info: {
            title: 'Sample',
            description: 'Api documentation for Sample',
            termsOfService: 'http://example.com/terms',
            contact: {
                name: 'Bhavesh Bheda',
                url: 'http://www.coruscate.info/chat/index.html',
                email: 'support@coruscate.co.in'
            },
            license: {name: 'Apache 2.0', url: 'http://www.apache.org/licenses/LICENSE-2.0.html'},
            version: '1.0.0'
        },
        host: (function () {
            let interfaces = require('os').networkInterfaces();
            for (let devName in interfaces) {
                let iface = interfaces[devName];
                for (let i = 0; i < iface.length; i++) {
                    let alias = iface[i];
                    if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                        return alias.address + ":" + 3000;
                    }
                }
            }
            return '127.0.0.1' + ":" + 3000;
        })(),
        basePath: '/',
        externalDocs: {url: 'http://www.coruscate.info'}
    }
};
