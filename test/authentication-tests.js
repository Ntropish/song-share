var test = require('tape');
var request = require('supertest');

module.exports = function(url) {
    test('Bad login tests', function (t) {
        var badLogin = function badLogin(username, password, message) {
            return request(url).post('/login').send({
                username: username,
                password: password
            })
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    t.error(err, 'Request should be successful');
                    t.equal(res.body.success, false, message);
                })
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
                t.end()
            }, function (err) {
                t.error(err, 'no errors should have happened when requesting');
            });
    });
}