define( ['parse', 'react', 'pages/HomePage'], function( Parse, React, HomePage){
    Parse.$ = jQuery;
<<<<<<< Updated upstream
    if ( window.location.hostname.indexOf("dev") == -1 ) //prod
    {
      Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu", "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");
    }
    else
    {
      Parse.initialize("TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq", "CZfXoAnHhHU46Id1GBZ0zB9LFKHZI0HZJt1GfTlo");
    }

=======
    Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);
>>>>>>> Stashed changes

    React.render(<HomePage />, document.getElementById('homePage'));
});
