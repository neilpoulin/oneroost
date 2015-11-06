define(['react', 'parse', 'parse-react', 'models/Deal', 'deal/Comments', 'deal/Profile'], function( React, Parse, ParseReact, Deal, Comments, DealProfile ){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        observe: function(){
          var user = Parse.User.current();

          return {
          }
        },
        getInitialState: function(){
            var component = this;
            return {
                dealId: OneRoost.dealId
            }
        },
        render: function(){
            var deal = this.props.deal;
            window.deal = deal;

            var budget = deal.get("budget");
            return(
                <div className="container dealContainer">
                    <div className="row">
                        <a href="/my/home"><i className="fa fa-angle-double-left"></i> Back to My Deals</a>
                    </div>
                    <div className="row">
                        <h1>{deal.get("dealName")}</h1>
                        <hr/>
                        <DealProfile
                            ref="dealProfile"
                            deal={deal}></DealProfile>
                        <hr/>
                        <Comments
                            ref="comments"
                            deal={deal}></Comments>
                    </div>
                </div>
            );
        }
    });
});
