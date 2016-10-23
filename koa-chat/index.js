const koa = require('koa');
const app = koa();
const serve = require('koa-static');
const logger = require('koa-logger');
const bodyParser = require('koa-bodyparser');
module.exports = serve('public');

const Router = require('koa-router');


app.use(serve('./client'));
app.use(logger());
app.use(bodyParser());

const router = new Router();

let clients = [];

router.get('/subscribe', function*() {

    this.set('Cache-Control', 'no-cache,must-revalidate');
    const promise = new Promise((resolve, reject) => {
        clients.push(resolve);

        this.res.on('close', function() {
            clients.splice(clients.indexOf(resolve), 1);
            const error = new Error('Connection closed');
            error.code = 'ECONNRESET';
            reject(error);
        });

    });

    let message;

    try {
        message = yield promise;
    } catch(err) {
        if (err.code === 'ECONNRESET') return;
        throw err;
    }

    // console.log('DONE', message);
    this.body = message;

});

router.post('/publish', function* () {
    const message = this.request.body.message;

    if (!message) {
        this.throw(400);
    }

    clients.forEach(function(resolve) {
        resolve(String(message));
    });

    clients = [];

    this.body = 'ok';

});

app.use(router.routes());

app.listen(3000);