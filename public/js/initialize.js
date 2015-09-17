$(function(){
    Parse.$ = jQuery;


    var React = require('react');
    var Parse = require('parse').Parse;
    var ParseReact = require('parse-react');

    // Initialize Parse with your Parse application javascript keys
    Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu",
        "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");



//    Parse.Config.get().then(function(config) {
//        console.log("Yay! Config was fetched from the server.");
//
//        var welcomeMessage = config.get("welcomeMessage");
//        console.log("Welcome Message = " + welcomeMessage);
//    }, function(error) {
//        console.log("Failed to fetch. Using Cached Config.");
//
//        var config = Parse.Config.current();
//        var welcomeMessage = config.get("welcomeMessage");
//        if (welcomeMessage === undefined) {
//            welcomeMessage = "Welcome!";
//        }
//        console.log("Welcome Message = " + welcomeMessage);
//    });
});
