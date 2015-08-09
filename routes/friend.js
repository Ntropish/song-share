/* globals console: false, module: false, require: false */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

router.post('/',
    function(req, res) {
        // Add the user with the given username to the authenticated user's friend list
        console.log(req.session.passport.user);
        //TODO: make this function
    });

router.delete('/',
    function(req, res) {
        // Remove the user with the given username from the authenticated user's friend list
        //TODO: make this function
    });

router.get('/',
    function(req, res) {
        // Get the authenticated user's friend list
        //TODO: make this function
    });