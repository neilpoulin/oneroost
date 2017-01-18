import React, { PropTypes } from "react"
import AccountSidebarItem from "account/AccountSidebarItem"
import RoostUtil from "RoostUtil"

const OpportunityList = React.createClass({
    propTypes: {
        deals: PropTypes.array.isRequired,
        archivedDeals: PropTypes.array,
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
            archived.map((deal, i) => {
                archived.push(<AccountSidebarItem
                    key={"account_" + deal.account.objectId + "_deal_" + deal.objectId + "_" + i}
                    deal={deal}
                    />)
            })
        }


        var list =
        <ul className={"AccountSidebarList " + this.props.className}>
            {deals.map(function(deal, i){
                var item =
                <AccountSidebarItem
                    key={"account_" + deal.account.objectId + "_deal_" + deal.objectId + "_" + i}
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
