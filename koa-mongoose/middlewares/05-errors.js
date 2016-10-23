const handlers = {
    '400': err => {
        let result = {
            errors: {}
        };
        const fields = Object.keys(err.errors);

        for (let field of fields) {
            result.errors[field] = err.errors[field].message;
        }
        return result;
    }
};

module.exports = function*(next) {

    try {
        yield* next;
    } catch (e) {
        console.log(e);
        if (e.status) {
            if (handlers[e.status]) {
                this.body = handlers[e.status](e);
            } else {
                this.body = e.message;
            }
            this.status = e.status;
        } else if (e.name === 'ValidationError') {
            this.status = 400;
            this.body = handlers['400'](e);
        } else {
            this.body = 'Error 500';
            this.status = 500;
        }
    }
};