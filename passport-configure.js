var passport = require('passport');
var LocalStrategy = require('passport-local');
var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
/*=======================================================================
 auth.js is used for passport configuration
 =======================================================================*/

passport.use(new LocalStrategy(function (username, password, done) {
    'use strict';

    var findUser = User.findOne({username: username}).exec();

    var verifyUserPassword = findUser.then(function(user){
        return new Promise(function(resolve, reject) {
            if (!user) {
                // Password can't match against a nonexistent user's password
                return resolve({isMatch:false, user:user});
            }
            user.verifyPassword(password, function (err, isMatch) {
                if (err) {
                    return reject(err);
                }
                resolve({isMatch:isMatch, user:user});
            });
        });
    }, function(err) {
        return done(err);
    });

    verifyUserPassword.then(function(results){
        return done(null, results.isMatch ? results.user : false)
    }, function(err){
        return done(err);
    });

}));

passport.serializeUser(function (user, done) {
    'use strict';
    done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    'use strict';
    User.findOne({username: username}, function (err, user) {
        done(err, user);
    });
});

module.exports = passport;