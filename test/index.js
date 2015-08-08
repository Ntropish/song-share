/* globals require: false */
var test = require('tape');
var request = require('supertest');
var url = 'localhost:3000';

require('./authentication-tests.js')(url);