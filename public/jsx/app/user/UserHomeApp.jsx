define( ['parse', 'react', 'pages/UserHomePage'], function( Parse, React, UserHomePage){
      Parse.$ = jQuery;
      Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);

      var Account = Parse.Object.extend("Account");

      React.render(<UserHomePage />, document.getElementById('userHome'));
});
