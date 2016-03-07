import React, { PropTypes } from 'react'
import Parse from 'parse';
import ParseReact from 'parse-react';
import AddStakeholderButton from './AddStakeholderButton';
import numeral from 'numeral';
import moment from 'moment';


const DealProfile = React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var user = Parse.User.current();
        // var stakeholderQuery = new Parse.Query( "Stakeholder" );
        // stakeholderQuery.include( "user" );
        // stakeholderQuery.include( "invitedBy" );
        // stakeholderQuery.equalTo( "deal", props.deal.objectId );
        return {
            // stakeholders: stakeholderQuery
        }
    },
    formatBudget: function( amount ){
        return numeral( amount ).format('($0.00a)');
    },
    formatDate: function( date ){
        if ( date != null && date != undefined )
        {
            return moment( date ).format('MMM D, YYYY');
        }
        return null;
    },
    render () {
        var deal = this.props.deal;
        var widgetClassName = 'col-md-4 widget';
        var iconSizeClassname = 'fa-3x';
        return (
            <div className="DealProfile container-fluid">
                <div className="row">
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <i className={"fa fa-usd " + iconSizeClassname}></i>
                        </div>
                        <div className="row text-center budget-high">
                            <i className="fa fa-caret-up"></i> {this.formatBudget( deal.budget.high ) }
                        </div>
                        <div className="row text-center budget-low">
                            <i className="fa fa-caret-down"></i> {this.formatBudget( deal.budget.low ) }
                        </div>
                    </div>
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <i className={"fa fa-calendar " + iconSizeClassname}></i>
                        </div>
                        <div className="row text-center">
                            {this.formatDate(deal.profile.timeline)}
                        </div>
                    </div>
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <i className={"fa fa-user " + iconSizeClassname}></i>
                        </div>
                        <div className="row">
                            <AddStakeholderButton deal={deal} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default DealProfile
