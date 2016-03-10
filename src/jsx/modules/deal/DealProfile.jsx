import React, { PropTypes } from 'react'
import Parse from 'parse';
import ParseReact from 'parse-react';
import AddStakeholderButton from './AddStakeholderButton';
import numeral from 'numeral';
import moment from 'moment';
import { Link } from 'react-router'
import NavLink from './../NavLink';

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
    formatBudget: function( amount, includeSymbol ){
        var format = '($0.00a)';
        if ( ! includeSymbol )
        {
            format = '(0.00a)'
        }
        return numeral( amount ).format(format);
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
        var widgetClassName = 'col-xs-4 widget';
        var iconSizeClassname = 'fa-lg';
        return (
            <div className="DealProfile container-fluid">
                <div className="row">
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <i className={"fa fa-usd " + iconSizeClassname}>
                                &nbsp;
                                {this.formatBudget( deal.budget.low, false ) } - {this.formatBudget( deal.budget.high, false ) }
                            </i>
                        </div>
                    </div>
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <i className={"fa fa-calendar " + iconSizeClassname}>
                                &nbsp;{this.formatDate(deal.profile.timeline)}
                            </i>
                        </div>
                    </div>
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <NavLink tag="span" to={"/deals/" + deal.objectId + "/stakeholders" } className="widgetLink" >
                                <i className={"fa fa-user " + iconSizeClassname}>&nbsp;Stakeholders</i>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default DealProfile
