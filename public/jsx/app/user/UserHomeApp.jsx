define( ['parse', 'react', 'pages/UserHomePage'], function( Parse, React, UserHomePage){
    Parse.$ = jQuery;
    Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu", "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");

      var Account = Parse.Object.extend("Account");

      React.render(<UserHomePage />, document.getElementById('userHome'));
});
