define( ['parse', 'react', 'pages/DealPage', 'models/Deal'], function( Parse, React, DealPage, Deal){
      Parse.$ = jQuery;
      Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);
      new Parse.Query(Deal).get(OneRoost.dealId, {
          success: function( deal )
          {
                React.render( <DealPage
                    deal={deal}
                    />, document.getElementById('dealPage'));
          }
      })

});
