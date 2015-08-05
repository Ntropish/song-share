var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOOSE_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function () {
    'use strict';
    console.log('user config connected to mongoose');
});

var userSchema = mongoose.Schema({
    username: { type: String, required: true, index: { unique: true }},
    password: { type: String, required: true }
});

userSchema.pre('save', function(next) {
    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

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

var User = mongoose.model('User', userSchema);

User.findUserByUsername = function(username, cb) {
    User.findOne({'username': username}, cb);
};

module.exports = User;