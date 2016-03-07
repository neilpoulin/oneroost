import React from 'react';
import Parse from 'parse';
import ParseReact from 'parse-react';
import Deal from './../models/Deal';
import Account from './../models/Account';
import Comments from './deal/Comments';
import NextStepsBanner from './nextsteps/NextStepsBanner';
import MenuItem from './sidebar/MenuItem';
import AddStakeholderButton from './deal/AddStakeholderButton';
import _ from 'underscore';
import $ from 'jquery';
import TopNav from './TopNav';
import LoadingTakeover from './util/LoadingTakeover';
import AccountSidebar from './account/AccountSidebar';

export default React.createClass(
    {
        mixins: [ParseReact.Mixin],
        observe: function(){
            var user = Parse.User.current();
            return {
                deal: (new Parse.Query(Deal).equalTo('objectId', this.props.params['dealId']) ),
                accounts: (new Parse.Query(Account)).equalTo('createdBy', user ),
                deals: (new Parse.Query(Deal)).equalTo('createdBy', user )
            }
        },
        getInitialState: function(){
            var component = this;
            return {
                dealId: component.props.params['dealId']
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

            if ( this.pendingQueries().length > 0 )
            {
                var message = "Loading...";

                if ( this.pendingQueries().indexOf( 'deal' ) == -1 )
                {
                    dealName = this.data.deal[0].dealName;
                    message = "Loading " + dealName;
                    document.title = "OneRoost Deal Page - " + dealName ;
                }

                return (
                    <LoadingTakeover size="3x" message={message} />
                );
            }
            var deal = this.data.deal[0];
            var dealName = deal.dealName;
            var budget = deal.budget;
            var accountMap = {};
            _.map(this.data.accounts, function(act){
                accountMap[act.objectId] = act;
            });

            // var accountSidebar = { this.data.deals.map(function(d){
            //     return (
            //         <MenuItem
            //             key={"deals_" + d.objectId}
            //             location={"/deals/" + d.objectId}
            //             className="profileCard">
            //             <div className="accountName">
            //                 {accountMap[d.account.objectId].accountName}
            //             </div>
            //             <div className="dealName">
            //                 {d.dealName}
            //             </div>
            //             <div className="primaryContact">
            //                 {accountMap[d.account.objectId].primaryContact}
            //             </div>
            //         </MenuItem>
            //     )
            // })};



            return(
                <div className="dealPageContainer">
                    <TopNav deal={deal} />
                    <div
                        className="container-fluid"
                        id="dealPageContainer">
                        <AccountSidebar/>
                        <div className="dealContainer col-md-10 col-md-offset-2 container-fluid">
                            <div className="row-fluid">
                                <div className="deal-top">
                                    <h1>
                                        {deal.dealName}
                                    </h1>
                                    <NextStepsBanner deal={deal} />
                                    <AddStakeholderButton deal={deal} />
                                </div>
                            </div>
                            <div className="row-fluid">
                                <Comments ref="comments" deal={deal} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });
