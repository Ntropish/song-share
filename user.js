/* globals console: false, module: false, require: false, process: false */
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
    password: { type: String, required: true },
    friends: [{ type : mongoose.Schema.ObjectId, ref: 'User'}]
});

userSchema.pre('save', function(next) {
    'use strict';
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

userSchema.methods.addFriend = function(newFriend) {
    'use strict';
    // Add a friend to this' friend list from a document or id string
    var id = typeof newFriend === 'string'? newFriend : newFriend._id;
    this.friends.push(id);
    return this.save();
};

userSchema.methods.removeFriend = function(friendNoMore) {
    'use strict';
    // Remove a friend from this' friend list based on a document or id string
    var id = typeof friendNoMore === 'string'? friendNoMore : friendNoMore._id;
    var index = this.friends.indexOf(id);
    if (index !== -1) {
        this.friends.splice(index, index+1);
        return this.save();
    }
    return Promise.reject('user id not found in friend list');

};

userSchema.statics.getIdFromUsername = function (username) {
    'use strict';
    // Returns a promise that fulfills with a user id
    return this.find({username: username}).exec().then(function (user) {
        return user._id;
    });
};

// Use the user schema to create the User model
var User = mongoose.model('User', userSchema);

module.exports = User;