import React, {PropTypes} from "react"
import NavLink from "NavLink"
import Parse from "parse"
import RoostUtil from "RoostUtil"

const AccountSidebarItem = React.createClass({
    propTypes: {
        deal: PropTypes.instanceOf(Parse.Object)
        // deal: PropTypes.shape({
        //     dealName: PropTypes.string,
        //     account: PropTypes.shape({
        //         objectId: PropTypes.isRequired,
        //         accountName: PropTypes.string.isRequired
        //     }).isRequired,
        //     objectId: PropTypes.string.isRequired,
        //     createdBy: PropTypes.object.isRequired,
        //     readyRoostUser: PropTypes.object
        // }).isRequired
    },
    render () {
        var deal = this.props.deal;

        var link =
        <NavLink className="AccountSidebarItem" to={"/roosts/" + deal.id} activeClassName="active">
            <span className="dealName">{RoostUtil.getRoostDisplayName(deal)}</span>
            <span className="accountName">{deal.get("dealName")}</span>
        </NavLink>

        return link;
    }
})

export default AccountSidebarItem
