import React, { PropTypes } from 'react'
import AccountSidebarItem from './AccountSidebarItem';

const AccountSidebarList = React.createClass({
    render () {
        return (
            <ul className="AccountSidebarList">
                {this.props.deals.map(function(deal){
                    return (
                        <AccountSidebarItem
                            key={"account_" + deal.account.objectId + "_deal_" + deal.objectId}
                            deal={deal}
                        />
                    )
                })}
            </ul>
        )
    }
})

export default AccountSidebarList
