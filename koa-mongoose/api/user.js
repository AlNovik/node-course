const Router = require('koa-router');
const {User, isObjectId} = require('../db');

const pick = require('lodash/pick');

const users = new Router({
    prefix: '/user'
});

users
    .param('id', function* (id, next) {
        if (!isObjectId(id)) {
            this.throw(404);
        }

        this.userById = yield User.findById(id);

        if (!this.userById) {
            this.throw(404);
        }

        yield* next;
    })
    .get('/', function*() {
        let users = yield User.find({});
        this.body = users.map(user => user.toObject())
    })
    .get('/:id', function*() {
        this.body = this.userById.toObject();
    })
    .post('/', function*() {
        let user = yield User.create(pick(this.request.body, User.publicFields.concat('password')));
        this.status = 201;
        this.body = user.toObject();
    })
    .patch('/:id', function*() {
        Object.assign(this.userById, pick(this.request.body, User.publicFields));
        yield this.userById.save();

        this.body = this.userById.toObject();
    })
    .delete('/:id', function*() {
        try {
            this.body = yield User.remove({_id: this.params.id});
        } catch (err) {
            this.throw(404, 'User not found');
        }

    });

module.exports = users;