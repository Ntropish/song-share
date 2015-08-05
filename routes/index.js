var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
    var root = path.join( __dirname, '../resources', 'html' );
    res.sendFile('test.html', {root: root});
});

module.exports = router;