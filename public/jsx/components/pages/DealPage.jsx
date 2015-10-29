define(['react', 'parse', 'parse-react'], function( React, Parse, ParseReact ){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        observe: function(){
          var user = Parse.User.current();
          var deal
          return {
            // accounts: (new Parse.Query(Parse.User)).ascending('createdAt').limit(10)
          }
        },
        getInitialState: function(){
            return {
                dealId: OneRoost.dealId
            }
        },
        render: function(){
            return(
                <div className="container-fluid">
                    <h1>Deal Page, Baby!</h1>
                    <div className="container col-md-8 col-md-offset-2 dealContainer">
                        this is where deals will be {this.state.dealId}
                    </div>
                </div>
            );
        }
    });
});
