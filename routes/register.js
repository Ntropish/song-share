/* globals console: false, module: false, require: false */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

//Register new user route, validates info and saves user to database internally
router.post('/',
    function(req, res) {
        'use strict';
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
            User.findOne({username: username}, function (err, user) {
                if (err) {
                    throw new Error(err);
                } else if (user) {
                    //user already exists
                    report.isExistingUser = true;
                } else {
                    var newUser = new User({username: username, password: password});
                    newUser.save(); //Should really error handle this
                    report.success = true;
                }
                res.send(report); //Should be up in these statements instead for async cases ^^^
                return report.success;
            });
        } else {
            //If we are here the report didn't get sent asynchronously so now it must be done
            res.send(report);
        }
    }
);

//Deletes current logged in user
router.delete('/', function(req, res){
    'use strict';
    var report = {
        success: false
    };
    if (!req.isAuthenticated()) {
        res.send(report);
        return false;
    }
    User.findOne({username: req.user.username}, function (err, user) {
        if (err) {
            report.databaseError = true;
        } else if (user) {
            req.logOut();
            user.delete();
            report.success = true;
        }
        res.send(report);
    });
});

module.exports = router;