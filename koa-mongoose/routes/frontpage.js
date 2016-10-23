exports.get = function* (next) {
    console.log('FrontPage');
    if (this.isAuthenticated()) {
        this.body = this.render('welcome');
    } else {
        this.body = this.render('login');
    }
};