/* globals module: false, require: false, console: false */
var test = require('tape');
var request = require('supertest-as-promised');

module.exports = {
    addFriend: function addFriend(t, agent, username) {
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
    },

    removeFriend: function removeFriend(t, agent, username) {
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
    },

    getFriends: function getFriends(t, agent) {
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
    },
    addCheckRemoveCheck: function (t, agent) {
        /*
         Add: adds a friend
         Check: gets friend list and checks for added friend
         Remove: removes added friend
         Check: gets friend list and checks for non existence of removed friend
         */
        return [
            // Add friend
            function () {
                return this.addFriend(t, agent, 'perry');
            },

            // Check that friend exists
            function () {

                return this.getFriends(t, agent).then(function (result) {
                    var friendList = result.body.friends;
                    t.notEqual(friendList.indexOf('perry'), -1, 'friend "perry" should exist in friends list');
                });
            },

            // Remove friend
            function () {
                return this.removeFriend(t, agent, 'perry');
            },

            // Check that friend doesn't exist
            function () {
                return this.getFriends(t, agent).then(function (result) {
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
                t.end();
            },
            function (err) {
                t.error(err, 'session should complete without errors');
                t.end();
            });
    }


};
