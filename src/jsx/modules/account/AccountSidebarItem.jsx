import React from 'react'
import { Link } from 'react-router'
import activeComponent from 'react-router-active-component'
import NavLink from './../NavLink';

const AccountSidebarItem = React.createClass({
    render () {
        var deal = this.props.deal;

        return (
            <NavLink className="AccountSidebarItem" to={"/deals/" + deal.objectId} activeClassName="active">
                <span className="dealName">{deal.dealName}</span>
                <span className="accountName">{deal.account.accountName}</span>
            </NavLink>
        )
    }
})

export default AccountSidebarItem
