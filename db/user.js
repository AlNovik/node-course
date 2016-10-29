const pick = require('lodash/pick');
const passwordUtils = require('./passwordUtils');

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
        },
        gender: {
            type: String,
            enum: {
                values: ['male', 'female'],
                message: 'Неизвестное значение для пола.'
            }
        },
        providers: [{
            name: String,
            nameId: {
                type: String,
                index: true
            }
        }]
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
        .set(function(password) {
            if (password && password.length < 4) {
                this.invalidate('password', 'Пароль должен быть минимум 4 символа');
            }

            this._plainPassword = password;

            if (password) {
                this.salt = passwordUtils.generateSalt();
                this.passwordHash = passwordUtils.hashPassword(password, this.salt);
            } else {
                this.salt = undefined;
                this.passwordHash = undefined;
            }
        })
        .get(function() {
            return this._plainPassword
        });

    UserSchema.methods.checkPassword = function(password) {
        if (!password) return false;
        if (!this.passwordHash) return false;

        return passwordUtils.hashPassword(password, this.salt) === this.passwordHash;
    };

    return mongoose.model('User', UserSchema);
};