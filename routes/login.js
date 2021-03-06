/* globals console: false, module: false, require: false */
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

//Authenticates using body.username and body.password
router.post(
    '/',
    function(req, res, next) {
        'use strict';
        res.setHeader('Content-Type', 'application/json');
        var username = req.body.username;
        var password = req.body.password;
        var report = {
            usernameIsInvalid: false,
            passwordIsInvalid: false,
            success: false
        };
        //There must be a username and it can only have letters and numbers
        if (!username || username.match(/[^\w\d]/g)) {
            report.usernameIsInvalid = true;
        }
        //There must be a password and it can't have any scary characters
        if (!password || password.match(/[:/\\\.><';,"\)\(\-\+]/g)) {
            report.passwordIsInvalid = true;
        }
        if (!report.usernameIsInvalid && !report.passwordIsInvalid) {
            passport.authenticate('local', function (err, user, info) {
                if (err) {
                    throw new Error(err);
                }
                if (!user) {
                    report.noUserFound = true;
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
        else {
            res.send(report);
        }
    }
);

//Sends the username and location of the current user
router.get(
    '/',
    function (req, res) {
        'use strict';
        var report = {
            success: false,
            isAuthenticated: false
        };

        if (req.isAuthenticated()) {
            report.isAuthenticated = true;
            report.success = true;
            report.username = req.user.username;
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
            res.send(report);
        }

    }
);

module.exports = router;