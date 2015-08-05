var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

//Authenticates using body.username and body.password
router.post(
    '/',
    function(req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            var report = {success: false};
            if (err) {
                throw new Error(err);
            }
            if (!user) {
                res.send(report);
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        console.error('login error:', err);
                    } else {
                        report.success = true;
                    }
                    res.send(report);
                });
            }

        })(req, res, next);
    }
);

//Sends the username and location of the current user
router.get(
    '/',
    function (req, res) {
        var report = {success: false};
        if (req.isAuthenticated()) {
            report.success = true;
            report.username = req.session.passport.user;
            User.findOne({username: report.username}, function (err, user) {
                if (err) {
                    console.error('database error:', err);
                }
                if (user) {
                    report.found = true;
                }
                res.send(report);
            });
        } else {
            report.isNotAuthenticated = true;
            res.send(report);
        }

    }
);

module.exports = router;