define( ['examples/ExampleApp', 'parse', 'react'], function(ExampleApp, Parse, React){
    Parse.$ = jQuery;
    if ( window.location.hostname.indexOf("dev") == -1 ) //prod
    {
      Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu", "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");
    }
    else
    {
      Parse.initialize("TFy4TyyJJGpG7gnOUWzOZNtMcCkqQlYTfa4mJWQq", "CZfXoAnHhHU46Id1GBZ0zB9LFKHZI0HZJt1GfTlo");
    }


      var Account = Parse.Object.extend("Account");

      React.render(<ExampleApp />, document.getElementById('jqueryexample'));
});
