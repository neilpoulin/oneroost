import React, { PropTypes } from 'react'
import StakeholderSidebar from './sidebar/StakeholderSidebar'
import { Link } from 'react-router'

const FixedSidebar = React.createClass({
    render () {
        return (
            <div className={"FixedSidebar container-fluid col-xs-12 col-md-" + this.props.columns}>
                <Link to={"/deals/" + this.props.children.props.params.dealId}
                    className="pull-right" >
                    <i className="fa fa-times fa-lg"></i>
                </Link>
                {this.props.children}
            </div>
        )
    }
})

export default FixedSidebar
