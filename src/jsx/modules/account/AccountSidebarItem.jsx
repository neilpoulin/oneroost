import React, {PropTypes} from "react"
import NavLink from "NavLink"
import RoostUtil from "RoostUtil"

const AccountSidebarItem = React.createClass({
    propTypes: {
        deal: PropTypes.shape({
            dealName: PropTypes.string,
            account: PropTypes.shape({
                objectId: PropTypes.isRequired,
                accountName: PropTypes.string.isRequired
            }).isRequired,
            objectId: PropTypes.string.isRequired,
            createdBy: PropTypes.object.isRequired,
            readyRoostUser: PropTypes.object
        }).isRequired
    },
    render () {
        var deal = this.props.deal;

        var link =
        <NavLink className="AccountSidebarItem" to={"/roosts/" + deal.objectId} activeClassName="active">
            <span className="dealName">{RoostUtil.getRoostDisplayName(deal)}</span>
            <span className="accountName">{deal.dealName}</span>
        </NavLink>

        return link;
    }
})

export default AccountSidebarItem
