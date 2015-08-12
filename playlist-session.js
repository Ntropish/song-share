/* globals console: false, module: false, require: false, process: false */
var mongoose = require('mongoose');


module.exports = function (mongoose) {
    'use strict';
    var sessionSchema = mongoose.Schema({
        owner: {type: String, required: true, index: {unique: true}},
        songList: [{
            url: {type: String, required: true},
            time: {type: Number, 'default': 0, required: true}
        }],
        nowPlaying: {type: Number, 'default': 0, required: true},
        friendsOnly: {type: Boolean, 'default': false, required: true},
        songTime: Number
    });
    var PlayerSession = mongoose.model('PlaylistSession', sessionSchema);

};