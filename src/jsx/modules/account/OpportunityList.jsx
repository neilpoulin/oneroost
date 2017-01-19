import React, { PropTypes } from "react"
import AccountSidebarItem from "account/AccountSidebarItem"
import RoostUtil from "RoostUtil"
import {Map} from "immutable"

const OpportunityList = React.createClass({
    propTypes: {
        deals: PropTypes.arrayOf(Map).isRequired,
        archivedDeals: PropTypes.arrayOf(Map).isRequired,
        className: PropTypes.string
    },
    getDefaultProps(){
        return {
            className: "",
            deals: [],
            archivedDeals: [],
        }
    },
    render () {
        var deals = this.props.deals.sort((a, b) => RoostUtil.getRoostDisplayName(a).toUpperCase().localeCompare( RoostUtil.getRoostDisplayName(b).toUpperCase() ) );
        var archivedDeals = this.props.archivedDeals.sort((a, b) => RoostUtil.getRoostDisplayName(a).toUpperCase().localeCompare( RoostUtil.getRoostDisplayName(b).toUpperCase() ) );
        let archived = []

        if ( archivedDeals.legnth > 0 ){
            archived.push(<li className="divider">Archived</li>)
            archivedDeals.map((deal, i) => {
                let dealId = deal.objectId
                let accountId = deal.account.objectId
                archived.push(<AccountSidebarItem
                    key={"account_" + accountId + "_deal_" + dealId + "_" + i}
                    deal={deal}
                    />)
            })
        }


        var list =
        <ul className={"AccountSidebarList " + this.props.className}>
            {deals.map(function(deal, i){
                let dealId = deal.objectId
                let accountId = deal.account.objectId
                var item =
                <AccountSidebarItem
                    key={"account_" + accountId + "_deal_" + dealId + "_" + i}
                    deal={deal}
                    />
                return item;
            })}
            {archived.map(item => item)}
        </ul>;

        return list;
    }
})

export default OpportunityList
