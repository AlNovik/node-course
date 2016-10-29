const {User} = require('../../db/index');
const FacebookStrategy = require('passport-facebook').Strategy;
const authenticateByProfile = require('./authenticateByProfile');
const config = require('config');
const request = require('request-promise');
const co = require('co');

function UserAuthError(message) {
    this.message = message;
}

module.exports = new FacebookStrategy({
        clientID:          config.providers.facebook.appId,
        clientSecret:      config.providers.facebook.appSecret,
        callbackURL:       config.server.siteHost + "/oauth/facebook",
        // fields are described here:
        // https://developers.facebook.com/docs/graph-api/reference/v2.7/user
        profileURL:        'https://graph.facebook.com/me?fields=id,about,email,gender,link,locale,timezone,name,last_name,first_name,middle_name',
        passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {

        // req example:
        // '/callback/facebook?code=...',

        // accessToken:
        // ... (from ?code)

        // refreshToken:
        // undefined


        co(function*() {

            console.log(profile);

            let permissionError = null;
            // facebook won't allow to use an email w/o verification
            if (!profile.emails || !profile.emails[0]) { // user may allow authentication, but disable email access (e.g in fb)
                permissionError = "При входе разрешите доступ к email. Он используется для идентификации пользователя.";
            }

            if (permissionError) {
                // revoke facebook auth, so that next time facebook will ask it again (otherwise it won't)
                let response = yield request({
                    method: 'DELETE',
                    json: true,
                    url: "https://graph.facebook.com/me/permissions?access_token=" + accessToken
                });

                if (!response.success) {
                    throw new Error("Facebook auth delete call returned invalid result " + response);
                }

                throw new UserAuthError(permissionError);
            }

            let response = yield request.get({
                url: 'http://graph.facebook.com/v2.7/' + profile.id + '/picture?redirect=0&width=1000&height=1000',
                json: true
            });

            var photoData = response.data;

            profile.photos = [{
                value: photoData.url,
                type: photoData.is_silhouette ? 'default' : 'photo'
            }];

            profile.realName = profile._json.name;

        }).then(function() {
            authenticateByProfile(req, profile, done);
        }, function(err) {
            if (err instanceof UserAuthError) {
                done(null, false, {message: err.message});
            } else {
                done(err);
            }
        });

    }
);
