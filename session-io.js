/* globals console: false, module: false, require: false */
var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports = function(io){
    'use strict';

    var sessionNSP = io.of('playlist-session');

    sessionNSP.on('connection', function(socket) {
        console.log(socket.request.user);
    });
};
