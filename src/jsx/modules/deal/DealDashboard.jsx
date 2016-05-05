import React, { PropTypes } from 'react'
import AccountSidebar from './../account/AccountSidebar';

const DealDashboard = React.createClass({
    render () {
        return (
            <div>
                <AccountSidebar/>
                {this.props.children}
            </div>
        )
    }
})

export default DealDashboard
