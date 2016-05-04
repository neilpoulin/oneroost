import React, { PropTypes } from "react"
import AccountSidebarItem from "./AccountSidebarItem";

const AccountSidebarList = React.createClass({
    propTypes: {
        deals: PropTypes.array.isRequired
    },
    render () {
        var list =
        <ul className="AccountSidebarList">
            {this.props.deals.map(function(deal){
                var item =
                <AccountSidebarItem
                    key={"account_" + deal.account.objectId + "_deal_" + deal.objectId}
                    deal={deal}
                    />
                return item;
            })}
        </ul>;

        return list;
    }
})

export default AccountSidebarList
