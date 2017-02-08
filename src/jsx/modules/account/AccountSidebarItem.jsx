import React, {PropTypes} from "react"
import NavLink from "NavLink"
import * as RoostUtil from "RoostUtil"

const AccountSidebarItem = React.createClass({
    propTypes: {
        deal: PropTypes.object,
        currentUser: PropTypes.object.isRequired,
    },
    render () {
        const {deal, currentUser} = this.props;
        let dealName = deal.dealName
        let dealId = deal.objectId
        var link =
        <NavLink className="AccountSidebarItem" to={"/roosts/" + dealId} activeClassName="active">
            <span className="dealName">{RoostUtil.getRoostDisplayName(deal, currentUser)}</span>
            <span className="accountName">{dealName}</span>
        </NavLink>

        return link;
    }
})

export default AccountSidebarItem
