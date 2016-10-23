const path = require('path');

const root = process.cwd();

module.exports = {
    serverPort: 3000,
    mongo: {
        host: 'localhost',
        port: 27017,
        dbName: 'db'
    },
    secret: 'topsecret',
    crypto: {
        hash: {
            length: 128,
            iterations: process.env.NODE_ENV === 'production' ? 12000 : 1
        }
    },
    template: {
        root: path.join(root, 'templates')
    }
};