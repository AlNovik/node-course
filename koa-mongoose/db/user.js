const pick = require('lodash/pick');

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

    return mongoose.model('User', UserSchema);
};