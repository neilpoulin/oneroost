define(['react', 'parse', 'parse-react', 'models/Deal', 'models/Account', 'deal/Comments', 'next-steps/NextStepsBanner', 'sidebar/MenuItem', 'deal/AddStakeholderButton'],
        function( React, Parse, ParseReact, Deal, Account, Comments, NextStepsBanner, MenuItem, AddStakeholderButton){
    return React.createClass({
        mixins: [ParseReact.Mixin],
        observe: function(){
            var user = Parse.User.current();
            return {
                accounts: (new Parse.Query(Account)).equalTo('createdBy', user ),
                deals: (new Parse.Query(Deal)).equalTo('createdBy', user )
            }
        },
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
        startCommentResize: function(){
            var component = this;
            component.refs.comments.updateDimensions();
            this.props.commentResizeInterval = setInterval( function(){
                component.refs.comments.updateDimensions();
            }, 100 );
        },
        stopCommentResize: function(){
            clearTimeout( this.props.commentResizeInterval );
            this.refs.comments.updateDimensions();
        },
        render: function(){
            var deal = this.props.deal;
            document.title = "OneRoost Deal Page - " + deal.get("dealName");
            var budget = deal.get("budget");

            var accountMap = {};
            _.map(this.data.accounts, function(act){
                accountMap[act.objectId] = act;
            });
            var deal = this.props.deal;

            return(
                <div className="container-fluid" id="dealPageContainer">
                    <div id="accountSidebar" className="col-md-2 container-fluid hidden-sm hidden-xs">
                        {this.data.deals.map(function(deal){
                            return <MenuItem location={"/deals/" + deal.objectId} className="profileCard">
                                <div className="accountName">{accountMap[deal.account.objectId].accountName}</div>
                                <div className="dealName">{deal.dealName}</div>
                                <div className="primaryContact">{accountMap[deal.account.objectId].primaryContact}</div>
                            </MenuItem>
                        })}
                    </div>
                    <div className="dealContainer col-md-10 col-md-offset-2 container-fluid">
                        <div className="row-fluid">
                            <div className="deal-top">
                                <h1>{deal.get("dealName")}</h1>
                                <hr/>
                                <NextStepsBanner deal={deal} ></NextStepsBanner>
                                <hr/>
                                <AddStakeholderButton
                                    deal={deal}
                                    />
                            </div>
                        </div>
                        <div className="row-fluid">
                            <Comments ref="comments" deal={deal} />
                        </div>
                    </div>
                </div>
            );
        }
    });
});
