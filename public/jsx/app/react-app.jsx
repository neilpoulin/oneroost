define( ['examples/ExampleApp', 'parse', 'react'], function(ExampleApp, Parse, React){
    Parse.$ = jQuery;
    Parse.initialize("lSNtmvBTimEY6VfOo5zvvOQkljcHeDIOQcjefNUu", "EZKlfRO9ydZrpO2fpLkIRNTp9dEJxF4IyTh4VkWT");

      var Account = Parse.Object.extend("Account");

      React.render(<ExampleApp />, document.getElementById('jqueryexample'));
});
