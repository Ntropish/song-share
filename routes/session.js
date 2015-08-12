/* globals console: false, module: false, require: false */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var PlaylistSession = mongoose.model('PlaylistSession');

router.get('/:USERNAME', function (req, res) {
    'use strict';
    var report = {
        success: false,
        authorized: false
    };

    var getSession = function(name) {
        return PlaylistSession.findOne({owner: name}).exec();
    };

    var authenticateSession = function(session) {
        if (!session.friendsOnly) {
            report.authorized = true;
            return Promise.resolve(session);
        }
        User.findOne({username: session.owner}, function(err, owner) {
            if (err) {
                return Promise.reject('database error');
            } else if ( !owner ) {
                return Promise.reject('can not find owner');
            }

            if (owner.friends.indexOf(req.user._id) !== -1) {
                report.authorized = true;
                return Promise.resolve(session);
            }
            Promise.reject('user not authorized');
        });
    };

    var buildSession = function(session) {
        report.session = {
            songList: session.songList,
            nowPlaying: session.nowPlaying,
            songTime: session.songTime
        };
        return Promise.resolve(session);
    };

    [
        getSession,
        authenticateSession,
        buildSession
    ]
        .reduce(function (previous, returnPromise) {
            return previous.then(returnPromise);
        }, Promise.resolve(req.params.USERNAME))
        // Sequence session promise handling:
        .then(function () {
            report.success = true;
            res.send(report);
        },
        function (err) {
            res.send(report);
        });

    res.send(report);
});

module.exports = router;