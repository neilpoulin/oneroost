define( ['parse', 'react', 'pages/DealPage', 'TopNav', 'models/Deal'], function( Parse, React, DealPage, TopNav, Deal){
      Parse.$ = jQuery;
      Parse.initialize(OneRoost.Config.applicationId, OneRoost.Config.javascriptKey);
      new Parse.Query(Deal).get(OneRoost.dealId, {
          success: function( deal )
          {
                React.render(
                    <div>
                        <TopNav deal={deal} />
                        <DealPage deal={deal} />
                    </div>
                    , document.getElementById('dealPage')
                );
          }
      })

});
