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
            return User.getIdFromUsername(req.body.username).then(function (id) {
                report.userExists = true;
                return id;
            });
        };

        var addFriend = function (id) {
            // Returns a promise, MongoDB saving the new id to friend list
            return req.user.addFriend(id);
        };

        var handleSave = function (result) {
            // Returns a promise that updates the report
            report.friendListSaved = true;
            return result;
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
                console.error(err);
                console.log(err.stack);
            });

    });

router.delete('/',
    function (req, res) {
        'use strict';
        // Remove the user with the given username from the authenticated user's friend list

        var report = {
            success: false,
            userExists: false,
            friendExists: false,
            friendListSaved: false
        };

        var getFriendNoMoreId = function() {
            // Return a promise that fulfills with a user's id
            return User.getIdFromUsername(req.body.username).then(function (id) {
                report.userExists = true;
                return id;
            });
        };

        var deleteFriend = function(userId) {
            // Returns a promise that fulfills with a MongoDB save promise or rejects if friend doesn't exist
            return req.user.removeFriend(userId);
            /*
                .then(function(result){
                    report.friendExists = true;
                    //return result;
                }, function(err) {
                    report.friendExists = false;
                    return err;
                });
                */
        };

        var handleSave = function(result) {
            // Returns a MongoDB save promise that updates the report on fulfill
            report.friendExists = true;
            report.friendListSaved = true;
            return result;
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
                console.error(err);
                console.log(err.stack);
            });
    });

router.get('/',
    function (req, res) {
        'use strict';
        // Get the authenticated user's friend list
        var report = {
            success: false,
            isAuthenticated: req.isAuthenticated()
        };
        if (req.isAuthenticated()) {
            var friends = [];
            // Use populate to turn the user's friends property into array of usernames to return
            // Promises not used here due to single callback
            User.findOne({username: req.user.username}).populate('friends', 'username').exec(function (err, user) {
                if (err) {
                    report.dbError = true;
                    res.send(report);
                    throw err;
                } else if (user) {
                    report.success = true;
                    // Convert friends list from array of objects with username property to array of usernames
                    report.friends = [];
                    user.friends.forEach(function(element){
                        if (element) {
                            report.friends.push(element.username);
                        } else {
                            //TODO: Remove console.log
                            console.log('FOUND NULL FRIEND');
                        }
                    });
                    res.send(report);
                }
                else {
                    res.send(report);
                }
            });
        } else {
            res.send(report);
        }

    });

module.exports = router;