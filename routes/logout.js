/* globals console: false, module: false, require: false */
var express = require('express');
var router = express.Router();

router.post(
    '/', function(req, res){
        'use strict';
        req.logout();
        var report = {
            success: true
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(report);
    }
);

module.exports = router;
