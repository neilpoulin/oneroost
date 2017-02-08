import React, { PropTypes } from "react"
import AccountSidebarItem from "account/AccountSidebarItem"
import * as RoostUtil from "RoostUtil"
import {Map} from "immutable"

const OpportunityList = React.createClass({
    propTypes: {
        deals: PropTypes.arrayOf(Map).isRequired,
        archivedDeals: PropTypes.arrayOf(Map).isRequired,
        archivedVisible: PropTypes.bool.isRequired,
        className: PropTypes.string,
        user: PropTypes.object,
    },
    getDefaultProps(){
        return {
            className: "",
            deals: [],
            archivedDeals: [],
            archivedVisible: false,
        }
    },
    render () {
        let {user} = this.props
        var deals = this.props.deals.sort((a, b) => RoostUtil.getRoostDisplayName(a, user).toUpperCase().localeCompare( RoostUtil.getRoostDisplayName(b,user).toUpperCase() ) );
        var archivedDeals = this.props.archivedDeals.sort((a, b) => RoostUtil.getRoostDisplayName(a, user).toUpperCase().localeCompare( RoostUtil.getRoostDisplayName(b, user).toUpperCase() ) );
        let archived = []

        if ( this.props.archivedVisible && archivedDeals.length > 0 ){
            archived.push(<li className="divider" key="archived_divider">Archived</li>)
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
                    currentUser={user}
                    />
                return item;
            })}
            {archived.map(item => item)}
        </ul>;

        return list;
    }
})

export default OpportunityList
