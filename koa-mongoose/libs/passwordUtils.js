const crypto = require('crypto');
const config = require('config');

exports.hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync( password, salt,
        config.crypto.hash.iterations,
        config.crypto.hash.length,
        'sha1').toString('hex')
};

exports.generateSalt = () => crypto.randomBytes(config.crypto.hash.length).toString('base64');