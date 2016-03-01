import React from 'react'
import { Link } from 'react-router'

const AccountSidebarItem = React.createClass({
    render () {
        var deal = this.props.deal;
        return (
            <li className="AccountSidebarItem">
                <Link to={"/deals/" + deal.objectId}>
                    dealName: {deal.dealName}
                </Link>
                <br/>
                accountName: {deal.account.accountName}
            </li>
        )
    }
})

export default AccountSidebarItem
