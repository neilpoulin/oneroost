import React, { PropTypes } from "react"
import AccountSidebarItem from "account/AccountSidebarItem"
import RoostUtil from "RoostUtil"

const AccountSidebarList = React.createClass({
    propTypes: {
        deals: PropTypes.array.isRequired,
        className: PropTypes.string
    },
    getDefaultProps(){
        return {
            className: ""
        }
    },
    render () {
        var deals = this.props.deals.sort((a, b) => RoostUtil.getRoostDisplayName(a).toUpperCase().localeCompare( RoostUtil.getRoostDisplayName(b).toUpperCase() ) );

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
        </ul>;

        return list;
    }
})

export default AccountSidebarList
