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
    observe(props, state){
        var stakeholderQuery = (new Parse.Query("Stakeholder"));
		stakeholderQuery.equalTo( 'deal', props.deal );
        return {
            stakeholders: stakeholderQuery
        }
    },
    getBudgetString(){
        var deal = this.props.deal;
        var budget = deal.budget;
        if ( !budget )
        {
            return "Not Set";
        }

        if( budget.low == budget.high )
        {
            if ( budget.low > 0 )
            {
                return this.formatMoney( budget.low, false );
            }
            return "0";
        }
        return this.formatMoney( budget.low, false ) + " - " + this.formatMoney( budget.high, false );
    },
    formatMoney( amount, includeSymbol ){
        var format = '($0.00a)';
        if ( ! includeSymbol )
        {
            format = '(0.00a)'
        }
        return numeral( amount ).format(format);
    },
    formatDate( date ){
        if ( date != null && date != undefined )
        {
            return moment( date ).format('MMM D, YYYY');
        }
        return null;
    },
    render () {
        var deal = this.props.deal;
        var widgetClassName = 'col-xs-4 widget';
        var iconSizeClassname = 'fa-2x';
        var budget = this.getBudgetString();

        var stakeholderCount = "";
        if ( this.pendingQueries().length == 0 )
        {
            stakeholderCount = this.data.stakeholders.length > 0 ? this.data.stakeholders.length : "";
        }

        return (
            <div className="DealProfile container-fluid">
                <div className="row">
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <i className={"fa fa-usd " + iconSizeClassname}></i>
                            &nbsp;
                            <span className="title">{budget}</span>
                        </div>
                    </div>
                    <div className={widgetClassName}>
                        <div className={"row text-center " + (deal.profile.timeline ? '' : 'invisible')}>
                            <i className={"fa fa-calendar " + iconSizeClassname}></i>
                            &nbsp; <span className="title">{this.formatDate(deal.profile.timeline)}</span>
                        </div>
                    </div>
                    <div className={widgetClassName}>
                        <div className="row text-center">
                            <NavLink tag="span" to={"/deals/" + deal.objectId + "/stakeholders" } className="widgetLink" >
                                <i data-badge={stakeholderCount} className={"fa icon-badge fa-user " + iconSizeClassname}></i>
                                <span className="title">&nbsp;Stakeholders</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

export default DealProfile
