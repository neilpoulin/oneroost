import React, { PropTypes } from 'react'
// import {Parse} from './../../config/OneRoost';
import Parse from 'parse';
Parse.serverURL = OneRoost.Config.parseSeverURL;
import ParseReact from 'parse-react';
import LoadingTakeover from './../util/LoadingTakeover';
import NextStepsBanner from './../nextsteps/NextStepsBanner';
import Comments from './../deal/Comments';
import DealProfile from './DealProfile';
import DealPageBottom from './DealPageBottom';
import { Link } from 'react-router'

const Deal = React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var user = Parse.User.current();
        return {
            deal: (new Parse.Query("Deal").equalTo('objectId', props.params.dealId ) )
        }
    },
    render () {
        if ( this.pendingQueries().length > 0 )
        {
            var message = "Loading...";
            if ( this.pendingQueries().indexOf( 'deal' ) == -1 )
            {
                var dealName = this.data.deal[0].dealName;
                message = "Loading " + dealName;
                document.title = "OneRoost Deal Page - " + dealName ;
            }

            return (
                <LoadingTakeover size="3x" message={message} />
            );
        }
        var deal = this.data.deal[0];
        if ( !deal )
        {
            return (
                <div>ERROR</div>
            )
        }
        return (
            <div className="Deal">
                <div
                    className="container-fluid"
                    id="dealPageContainer">
                    <div className="dealContainer col-md-10 col-md-offset-2 container-fluid">
                        <div className="row-fluid">
                            <div className="deal-top">
                                <h1>
                                    {deal.dealName}
                                </h1>
                                <DealProfile deal={deal} />
                                <NextStepsBanner deal={deal} />
                            </div>
                        </div>
                        <div className="row-fluid">
                            <DealPageBottom ref="dealPageBottom" deal={deal}>
                                {this.props.children}
                            </DealPageBottom>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
})

export default Deal
