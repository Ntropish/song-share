/* globals console: false, module: false, require: false */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/',
    function (req, res) {
        'use strict';
        // Add the user with the given username to the authenticated user's friend list

        // Assume nothing will pass, update the report as conditions do pass
        var report = {
            success: false,
            userExists: false,
            friendListSaved: false
        };

        var getPotentialFriendId = function () {
            // Returns a promise that fulfills with a user id
            return User.getIdFromUsername(req.body.potentialFriend).then(function (id) {
                report.userExists = true;
                return id;
            });
        };

        var addFriend = function (id) {
            // Returns a promise, MongoDB saving the new id to friend list
            return req.session.passport.user.addFriend(id);
        };

        var handleSave = function (result) {
            // Returns a promise that updates the report
            return result.then(function () {
                report.friendListSaved = true;
            });
        };

        // Execute promises
        [
            getPotentialFriendId,
            addFriend,
            handleSave
        ]
            .reduce(function (previous, returnPromise) {
                return previous.then(returnPromise);
            }, Promise.resolve())
            // Sequence session promise handling:
            .then(function () {
                report.success = true;
                res.send(report);
            },
            function (err) {
                res.send(report);
            });

    });

router.delete('/',
    function (req, res) {
        'use strict';
        // Remove the user with the given username from the authenticated user's friend list

        var report = {
            success: false,
            friendExists: false,
            friendListSaved: false
        };

        var getFriendNoMoreId = function() {
            // Return a promise that fulfills with a user's id
            return User.getIdFromUsename(req.body.friendNoMore);
        };

        var deleteFriend = function(userId) {
            // Returns a promise that fulfills with a MongoDB save promise or rejects if friend doesn't exist
            return req.session.passport.user.deleteFriend(userId)
                .then(null, function(err) {
                    report.friendExists = false;
                    return err;
                });
        };

        var handleSave = function(result) {
            // Returns a MongoDB save promise that updates the report on fulfill
            return result.then(function(){
                report.friendListSaved = true;
            });
        };

        // Execute promises
        [
            getFriendNoMoreId,
            deleteFriend,
            handleSave
        ]
            .reduce(function (previous, returnPromise) {
                return previous.then(returnPromise);
            }, Promise.resolve())
            // Sequence session promise handling:
            .then(function () {
                report.success = true;
                res.send(report);
            },
            function (err) {
                res.send(report);
            });
    });

router.get('/',
    function (req, res) {
        'use strict';
        // Get the authenticated user's friend list
        //TODO: make this function
        var report = {
            success: false,
            isAuthenticated: req.isAuthenticated()
        };
        var friends = [];

        // Use populate to turn the user's friends property into array of usernames to return
        // Promises not used here due to single callback
        req.session.passport.user.populate('friends', 'username').exec(function(err, user) {
            if (err) {
                report.dbError = true;
                res.send(report);
            } else if (user) {
                report.success = true;
                report.friends = user.friends;
                res.send(report);
            }
            else {
                res.send(report);
            }
        });

    });