define(['react', 'parse', 'parse-react', 'models/Deal', 'deal/Comments'], function( React, Parse, ParseReact, Deal, Comments ){
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
                <div className="container-fluid">
                    <div className="container col-md-8 col-md-offset-2 dealContainer">
                        <h1>{deal.get("dealName")}</h1>

                        <div className="row">
                            Budget High: {budget.high} <br/>
                            Budget Low: {budget.low}
                        </div>
                        <Comments
                            ref="comments"
                            deal={deal}></Comments>
                    </div>
                </div>
            );
        }
    });
});
