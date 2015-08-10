/* globals module: false, require: false, console: false */
var test = require('tape');
var request = require('supertest-as-promised');

var addFriend = function addFriend(t, agent, username) {
    'use strict';
    // Returns a promise of a post /friend request and handles request errors
    return agent.post('/friend')
        .send({
            username: username
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result) {
            t.error(null, 'no errors should have happened when posting');
            return result;
        }, function (err) {
            t.error(err, 'no errors should have happened when posting');
        });
};

var removeFriend = function removeFriend(t, agent, username) {
    'use strict';
    // Returns a promise of a delete /friend request and handles request errors
    return agent.delete('/friend')
        .send({
            username: username
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result) {
            t.error(null, 'no errors should have happened when deleting');
            return result;
        }, function (err) {
            t.error(err, 'no errors should have happened when deleting');
        });
};

var getFriends = function getFriends(t, agent) {
    'use strict';
    // Returns a promise of a get /friend request and handles request errors
    return agent.get('/friend')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(function (result) {
            t.error(null, 'no errors should have happened when getting');
            return result;
        }, function (err) {
            t.error(err, 'no errors should have happened when getting');
        });
};

module.exports = {
    addFriend: addFriend,

    removeFriend: removeFriend,

    getFriends: getFriends,

    addCheckRemoveCheck: function (t, agent) {
        'use strict';
        /*
         Add: adds a friend
         Check: gets friend list and checks for added friend
         Remove: removes added friend
         Check: gets friend list and checks for non existence of removed friend
         */
        return [
            // Add friend
            function () {
                return addFriend(t, agent, 'perry').then(function(result){
                    t.equal(result.body.success, true, 'new friend should be added successfully');
                });
            },

            // Check that friend exists
            function () {

                return getFriends(t, agent).then(function (result) {

                    var friendList = result.body.friends;
                    t.notEqual(friendList.indexOf('perry'), -1, 'friend "perry" should exist in friends list');
                });
            },

            // Remove friend
            function () {
                return removeFriend(t, agent, 'perry').then(function(res){
                    t.equal(res.body.success, true, 'friend should be removed successfully');
                });
            },

            // Check that friend doesn't exist
            function () {
                return getFriends(t, agent).then(function (result) {
                    var friendList = result.body.friends;
                    t.equal(friendList.indexOf('perry'), -1, 'friend "perry" should not exist in friends list');
                });
            }

        ]
            // Execute promises sequentially
            .reduce(function (previous, returnPromise) {
                return previous.then(returnPromise);
            }, Promise.resolve())
            .then(function () {
                t.error(undefined, 'session should complete without errors');
            },
            function (err) {
                t.error(err, 'session should complete without errors');
            });
    }


};
