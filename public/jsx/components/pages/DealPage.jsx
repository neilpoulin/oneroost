define(['react', 'parse', 'models/Deal', 'deal/Comments', 'deal/Profile'], function( React, Parse, Deal, Comments, DealProfile ){
    return React.createClass({
        getInitialState: function(){
            var component = this;
            return {
                dealId: OneRoost.dealId
            }
        },
        showLeftMenu: function()
        {
            this.refs.left.show();
        },
        render: function(){
            var deal = this.props.deal;
            document.title = "OneRoost Deal Page - " + deal.get("dealName");
            var budget = deal.get("budget");

            return(
                <div>
                    <div className="container dealContainer">
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
                </div>
            );
        }
    });
});
