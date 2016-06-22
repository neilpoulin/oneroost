import React, { PropTypes } from "react"
import NavLink from "./../NavLink";
import Parse from "parse";
import AccountSidebar from "./../account/AccountSidebar";

const DealDashboard = React.createClass({
    propTypes: {
        children: PropTypes.object.isRequired
    },
    render () {
        var dashboard =
        <div>
            <AccountSidebar/>
            {this.props.children}
        </div>

        return dashboard;
    }
})

export default DealDashboard
