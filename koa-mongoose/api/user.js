const Router = require('koa-router');
const {User} = require('../db');

const users = new Router({
    prefix: '/user'
});

users.get('/', function* () {
    this.body = yield User.find({});
});

users.get('/:id', function* () {
    try {
        this.body = yield User.findById(this.params.id);
    } catch (err) {
        this.throw(404, 'User not found');
    }
});

users.post('/', function* () {
    try {
        this.body = yield User.create(this.request.body);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            this.throw(400, err);
        } else {
            this.throw(err);
        }
    }
});

users.delete('/:id', function* () {
    try {
        this.body = yield User.remove({_id: this.params.id});
    } catch (err) {
        this.throw(404, 'User not found');
    }

});

module.exports = users;