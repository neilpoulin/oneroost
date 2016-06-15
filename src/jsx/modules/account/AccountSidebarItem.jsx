import React, {PropTypes} from "react"
import NavLink from "./../NavLink";

const AccountSidebarItem = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    render () {
        var deal = this.props.deal;
        var link =
        <NavLink className="AccountSidebarItem" to={"/roosts/" + deal.objectId} activeClassName="active">
            <span className="dealName">{deal.dealName}</span>
            <span className="accountName">{deal.account.accountName}</span>
        </NavLink>

        return link;
    }
})

export default AccountSidebarItem
