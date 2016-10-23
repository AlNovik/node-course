const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('config');

mongoose.Pomise = Promise;

mongoose.set('debug', true);

mongoose.connect(`mongodb://${config.get('mongo.host')}:${config.get('mongo.port')}/${config.get('mongo.dbName')}`);

mongoose.plugin(beautifyUnique);

exports.User = require('./user')(mongoose);