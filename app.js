/* globals console: false, require: false, process: false, module: false */
var express = require('express');
var async = require('async');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');

// Make app and require things with app as a dep
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// My modules
var User = require('./user');
var passport = require('./passport-configure');

// Apply middleware
app.use(favicon(path.join(__dirname, 'resources', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'silly dog'
}));
app.use(passport.initialize());
app.use(passport.session());

// Require routes
var register = require('./routes/register');
var login = require('./routes/login');
var logout = require('./routes/logout');
var index = require('./routes/index');
var friend = require('./routes/friend');

// Apply routes

app.use('/',         index);
app.use('/register', register);
app.use('/login',    login);
app.use('/logout',   logout);
app.use('/friend',   friend);


// Set public directory to serve static
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine and view directory
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    'use strict';
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        'use strict';
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user1
app.use(function (err, req, res, next) {
    'use strict';
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

mongoose.connect(process.env.MONGOOSE_URI);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',function () {
    'use strict';
    console.log('connected to mongoose');
});

module.exports = app;