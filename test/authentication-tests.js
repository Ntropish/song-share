/* globals module: false, require: false, console: false */
var test = require('tape');
var request = require('supertest-as-promised');
var friendTests = require('./friend-tests');

module.exports = function (url) {
    'use strict';
    var loginPost = function loginPromise(username, password, success, message, t, sender) {
        // If a sender was specified use that, to allow supertest agents, otherwise default to request(url)
        sender = sender || request(url);
        return sender.post('/login').send({
            username: username,
            password: password
        })
            .expect('Content-Type', /json/)
            .expect(200)
            .then(function (res) {
                t.equal(res.body.success, success, message);
            }, function (err) {
                t.error(err, 'Request should be successful');
            });
    };

    test('Bad login tests', function (t) {
        var badLogin = function (username, password, message) {
            return loginPost(username, password, false, message, t);
        };
        Promise.all(
            [
                badLogin('cat', 'wrong-password', 'login with wrong password should fail'),
                badLogin('', 'wrong-password', 'login with no username should fail'),
                badLogin('cat', '', 'login with no password should fail'),
                badLogin('-=5%%>0-08-13;???<', 'wrong-password', 'login with silly username should fail'),
                badLogin(undefined, undefined, 'login with no credentials should fail')
            ])
            .then(function () {
                // Added this test to have consistent number of tests each time
                t.error(null, 'no errors should have happened when requesting');
                t.end();
            }, function (err) {
                t.error(err, 'no errors should have happened when requesting');
                t.end();
            });
    });

    test('Full session tests', function (t) {
        // Expects to get good credentials, returns a promise
        var goodLogin = function (username, password, message, sender) {
            return loginPost(username, password, true, message, t, sender);
        };
        // Attempts to get user info, returns a promise
        var loginGet = function (sender) {
            sender = sender || request(url);
            return sender.get('/login')
                .expect('Content-Type', /json/)
                .expect(200)
                .then(function (res) {
                    t.error(undefined, 'no errors should have happened making login get request');
                    return res;
                }, function (err) {
                    t.error(err, 'no errors should have happened making login get request');
                });

        };

        var cat = request.agent(url);

        // Array of promise returning functions to execute in sequence
        [
            // Login
            function () {
                return goodLogin('cat', 'bat', 'valid credentials should successfully login', cat);
            },
            // Get Name, should get a name
            function () {
                return loginGet(cat).then(function (res) {
                    t.equal(res.body.username, 'cat', 'name should be returned when logged in');
                });
            },
            function () {
                return friendTests.addCheckRemoveCheck(t, cat);
            },
            // Logout
            function () {
                return cat.post('/logout')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then(function (res) {
                        t.error(undefined, 'no errors should have happened making logout get request');
                        return res;
                    }, function (err) {
                        t.error(err, 'no errors should have happened making logout get request');
                    });

            },
            // Get Name, shouldn't get a name
            function () {
                return loginGet(cat).then(function (res) {
                    t.equal(res.body.username, undefined, 'name shouldn\'t be returned when not logged in');
                });
            }
        ].reduce(function (previous, returnPromise) {
                return previous.then(returnPromise);
            }, Promise.resolve())
            // Sequence session promise handling:
            .then(function () {
                t.error(undefined, 'session should complete without errors');
                t.end();
            },
            function (err) {
                t.error(err, 'session should complete without errors');
                t.end();
            });

    });

};