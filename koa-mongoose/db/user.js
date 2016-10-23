const pick = require('lodash/pick');
const crypto = require('crypto');
const config = require('config');

const publicFields = ['email', 'displayName'];

module.exports = mongoose => {
    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: 'Укажите email',
            unique: 'Такой email уже есть :(',
            validate: [{
                validator: value => /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(value),
                msg: 'Email is wrong'
            }],
            lowercase: true,
            trim: true
        },
        displayName: {
            type: String,
            required: 'Укажите displayName',
            unique: 'Такое имя уже существует :('
        },
        deleted: Boolean,
        passwordHash: {
            type: String,
            required: true
        },
        salt: {
            type: String,
            required: true
        }
    }, {
        timestamps: true,
        toObject: {
            transform(doc, ret) {
                return pick(ret, publicFields);
            }
        }
    });

    UserSchema.statics.publicFields = publicFields;

    UserSchema.virtual('password')
        .set(password => {
            if (password && password.length > 4) {
                this.invalidate('password', 'Пароль должен быть минимум 4 символа');
            }

            this._plainPassword = password;

            if (password) {
                this.salt = crypto.randomBytes(config.crypto.hash.length);
                this.passwordHash = crypto.pbkdf2Sync(
                    password,
                    this.salt,
                    config.crypto.hash.iterations,
                    config.crypto.hash.length,
                    'sha1');
            } else {
                this.salt = undefined;
                this.passwordHash = undefined;
            }
        })
        .get(() => this._plainPassword);

    UserSchema.methods.checkPassword = password => {
        if (!password) return false;
        if (!this.passwordHash) return false;

        return crypto.pbkdf2Sync(
            password,
            this.salt,
            config.crypto.hash.iterations,
            config.crypto.hash.length,
            'sha1') === this.passwordHash;
    };

    return mongoose.model('User', UserSchema);
};