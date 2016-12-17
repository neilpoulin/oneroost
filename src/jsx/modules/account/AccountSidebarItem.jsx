import React, {PropTypes} from "react"
import NavLink from "./../NavLink"
import Parse from "parse"
import RoostUtil from "./../util/RoostUtil"

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

    getNames(){
        let deal = this.props.deal;
        let readyRoostUser = deal.readyRoostUser;
        let account = deal.account;
        let currentUser = Parse.User.current();
        let createdBy = deal.createdBy;

        let isCreator = RoostUtil.isCurrentUser(createdBy);
        let isReadyRoostUser = RoostUtil.isCurrentUser(readyRoostUser);

        let topName = "";
        let bottomName = currentUser.get("company");
        if ( !isCreator && createdBy.company ){
            topName = createdBy.company
        } else if ( readyRoostUser && !isReadyRoostUser && readyRoostUser.company ){
            topName = readyRoostUser.company;
        } else{
            topName = account.accountName;
        }

        return {
            topName: topName,
            bottomName: bottomName
        };
    },
    render () {
        var deal = this.props.deal;
        var names = this.getNames();
        var link =
        <NavLink className="AccountSidebarItem" to={"/roosts/" + deal.objectId} activeClassName="active">
            <span className="dealName">{names.topName}</span>
            <span className="accountName">{deal.dealName}</span>
        </NavLink>

        return link;
    }
})

export default AccountSidebarItem
