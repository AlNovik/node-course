const pug = require('pug');
const config = require('config');
const path = require('path');

module.exports = function* (next) {
    var ctx = this;

    this.locals = {
        get user() {
            return ctx.req.user;
        },

        get flash() {
            return ctx.flash();
        }
    };

    this.locals.csrf = () =>  ctx.req.user ? ctx.csrf : null;

    this.render = (templatePath, locals) => {
        locals = locals || {};

        let localsFull = Object.create(this.locals);
        let keys = Object.keys(locals);
        let templatePathResolved;

        for(let key of keys) {
            localsFull[key] = locals[key];
        }

        templatePathResolved = path.join(config.template.root, `${templatePath}.pug`);

        console.log(templatePathResolved);

        return pug.renderFile(templatePathResolved, localsFull);
    };

    yield* next;
};