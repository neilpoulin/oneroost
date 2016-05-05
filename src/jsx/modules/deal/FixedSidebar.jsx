import React, { PropTypes } from 'react'
import StakeholderSidebar from './sidebar/StakeholderSidebar'
import { Link } from 'react-router'

const FixedSidebar = React.createClass({
    render () {
        return (
            <div className={"FixedSidebar container-fluid col-xs-12 col-md-" + this.props.columns}>
                <div className="close">
                    <Link to={"/deals/" + this.props.children.props.params.dealId}
                        className="" >
                        <i className="fa fa-times fa-lg"></i>
                    </Link>
                </div>
                {this.props.children}
            </div>
        )
    }
})

export default FixedSidebar
