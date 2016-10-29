const koa = require('koa');
const app = koa();

const path = require('path');
const fs = require('fs');
const api = require('./api');
const routes = require('./routes');

require('trace');
require('clarify');

require('koa-csrf')(app);

let middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(middleware => {
    app.use(require(`./middlewares`));
});

app.use(routes.routes());
app.use(api.routes());

module.exports = app;