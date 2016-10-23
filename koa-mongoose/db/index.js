const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('config');

mongoose.Promise = Promise;

mongoose.set('debug', true);

mongoose.plugin(beautifyUnique);

mongoose.plugin(schema => {
    if(!schema.options.toObject) {
        schema.options.toObject = {};
    }

    if (!schema.options.toObject.transform) {
        schema.options.toObject.transform = (doc, ret) => {
            delete ret.__v;
            return ret;
        }
    }
});

mongoose.connect(`mongodb://${config.get('mongo.host')}:${config.get('mongo.port')}/${config.get('mongo.dbName')}`, {
    server: {
        socketOptions: {
            keepAlive: 1
        },
        poolSize: 5
    }
});


exports.isObjectId = id => mongoose.Types.ObjectId.isValid(id);

exports.User = require('./user')(mongoose);