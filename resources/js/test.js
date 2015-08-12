/* globals $: false, console: false, io: false */
$(document).ready(function(){
    'use strict';
    var socket = io.connect('http://localhost:8686/session');
    $('#submitRegister').on('click', function(event){
        event.preventDefault();
        var username = $('#usernameRegister').val();
        var password = $('#passwordRegister').val();
        var confirm  = $('#confirmRegister').val();

        if (password !== confirm) {
            console.log('pass don match');
            return;
        }
        $.ajax('/register',
            {
                type: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success: function(res) {
                    console.log(res);
                    if (res.success) {

                        console.log('Registered');
                    }
                }
            }

        );
    });
    $('#submitLogin').on('click', function(event){
        event.preventDefault();
        $.ajax('/login',
            {
                type: 'POST',
                data: {
                    username: $('#usernameLogin').val(),
                    password: $('#passwordLogin').val()
                },
                success: function(res) {
                    console.log(res);
                    if (res.success) {

                        console.log('Logged in');
                    }
                }
            }

        );
    });
    $('#getUsername').on('click', function(event){
        event.preventDefault();
        $.ajax('/login',
            {
                type: 'GET',
                success: function(res) {
                    console.log(res);
                    if (res.success) {
                        $('#usernameGet').val(res.username);
                        console.log('Got name');
                    }
                }
            }

        );
    });
    $('#connectToSocket').on('click', function(event){
        event.preventDefault();


    });
});
