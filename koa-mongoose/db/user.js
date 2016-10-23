
module.exports = mongoose => {
    const UserSchema = new mongoose.Schema({
        email: {
            type: String,
            required: 'Укажите email',
            unique: 'Такой email уже есть :(',
            // validate: [{
            //     validator: value => /^[-.\w]+@([\w-]{2,12}$)/.test(value),
            //     msg: 'Email is wrong'
            // }],
            lowercase: true,
            trim: true
        },
        displayName: {
            type: String,
            required: 'Укажите displayName'
        }
    }, {
        timestamps: true
    });

    UserSchema.set('toJSON', {
        transform: (doc, ret, options) => {
            return {
                email: ret.email,
                displayName: ret.displayName
            }
        }
    });

    return mongoose.model('User', UserSchema);
};