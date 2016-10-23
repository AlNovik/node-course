const koa = require('koa');
const app = koa();

const path = require('path');
const fs = require('fs');
const api = require('./api');
const routes = require('./routes');

require('koa-csrf')(app);

let middlewares = fs.readdirSync(path.join(__dirname, 'middlewares')).sort();

middlewares.forEach(middleware => {
    console.log(middleware);
    app.use(require(`./middlewares/${middleware}`));
});

app.use(routes.routes());
app.use(api.routes());

module.exports = app;