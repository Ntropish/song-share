var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');

/*
    Connect to mongoose, set up error display

    Log a connection message once connected.
    This message should be removed eventually
 */
mongoose.connect(process.env.MONGOOSE_URI);
var db = mongoose.connection;

//TODO: Remove logging messages
db.on('error', console.error.bind(console, 'user connection error:'));
db.once('open',function () {
    'use strict';
    console.log('user config connected to mongoose');
});

/*
    Define the user schema for the application
        username The name the user will log in and be identified by to themselves and other users
        password The string used to authenticate a user, gets hashed with bcrypt for security

    Hash passwords when saving a user

    Add a method to verify passwords
 */

var userSchema = mongoose.Schema({
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
    var user = this;
    //Check if the password changed and return otherwise so it isn't hashed twice
    if (!user.isModified('password')) {
        return next();
    }
    //TODO: Switch to promises
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.verifyPassword = function (passwordToCheck, cb) {
    'use strict';
    bcrypt.compare(passwordToCheck, this.password, function(err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};


// Use the user schema to create the User model
var User = mongoose.model('User', userSchema);


/*
User.findUserByUsername = function(username, cb) {
    User.findOne({'username': username}, cb);
};
*/
module.exports = User;