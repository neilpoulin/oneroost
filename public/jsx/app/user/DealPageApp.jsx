define( ['parse', 'react', 'pages/DealPage'], function( Parse, React, DealPage){
      Parse.$ = jQuery;
      Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);

      React.render(<DealPage />, document.getElementById('dealPage'));
});
