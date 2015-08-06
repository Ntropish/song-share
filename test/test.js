var should = require('should');
var assert = require('assert');
var request = require('supertest');
var rp = require('request-promise');
var mongoose = require('mongoose');
var querystring = require('querystring');
//var config = require('./config-debug');

describe('Authentication', function () {
    var url = 'http://localhost:3000';
    var logErrorThenDone = function logErrorThenDone(err) {
        return this(err);
    };
    describe('Bad user login', function () {
        it('should return failure trying to login with wrong password', function (done) {
            var handleError = logErrorThenDone.bind(done);
            var options = {
                url: url + '/login',
                method: 'POST',
                username: 'cat',
                password: 'lol'
            };

            rp(options).then(function (res) {
                res = JSON.parse(res);
                res.success.should.equal(false);
                done();
            }).catch(handleError);
        });

        it('should return failure trying to login with no name', function (done) {
            var handleError = logErrorThenDone.bind(done);
            var options = {
                url: url + '/login',
                method: 'POST',
                username: '',
                password: 'lol'
            };

            rp(options).then(function (res) {
                res = JSON.parse(res);
                res.success.should.equal(false);
                done();
            }).catch(handleError);
        });
        it('should return failure trying to login with no password', function (done) {
            var handleError = logErrorThenDone.bind(done);
            var options = {
                url: url + '/login',
                method: 'POST',
                username: 'cat',
                password: ''
            };

            rp(options).then(function (res) {
                res = JSON.parse(res);
                res.success.should.equal(false);
                done();
            }).catch(handleError);
        });
        it('should return failure trying to login with wrong username with symbols', function (done) {
            var handleError = logErrorThenDone.bind(done);
            var options = {
                url: url + '/login',
                method: 'POST',
                username: '987+4534++==//>>',
                password: 'password'
            };

            rp(options).then(function (res) {
                res = JSON.parse(res);
                res.success.should.equal(false);
                done();
            }).catch(handleError});
        });

    });

    describe('Good user login', function () {
        it('should successfully log in, get the username, log out, and not be able to get the username', function (done) {
            var data = {
                username: 'cat',
                password: 'bat'
            };
            var jsonData = querystring.stringify({
                username: 'cat',
                password: 'bat'
            });


            request('localhost:3000')
                .post('/login')
                .send(jsonData)
                .end(function(err, res) {
                    if (err) {
                        return done(err);
                    }
                    res.body.should
                    done();
                });

            /*
            var login = rp(loginOptions);
            var getUser = rp(getUserOptions);
            var logout = rp(logoutOptions);
            var getUserLoggedOut = rp(getUserOptions);

            login.then(function (res) {
                console.log(res);
                res = JSON.parse(res);
                res.success.should.equal(true);

                getUser.then(function (res) {
                    res = JSON.parse(res);
                    res.username.should.equal('cat');

                    logout.then(function (res) {
                        res = JSON.parse(res);
                        res.success.should.equal(true);

                        getUserLoggedOut.then(function (res) {
                            res = JSON.parse(res);
                            res.success.should.equal(false);
                            res.username.should.equal(undefined);

                            done();

                        }).catch(handleError);
                    }).catch(handleError);
                }).catch(handleError);
            }).catch(handleError);
*/

        });
    });
});