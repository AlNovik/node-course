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
        if (e.status) {
            if (handlers[e.status]) {
                this.body = handlers[e.status](e);
            } else {
                this.body = e.message;
            }
            this.status = e.status;
        } else {
            this.body = 'Error 500';
            this.status = 500;
        }

    }
};