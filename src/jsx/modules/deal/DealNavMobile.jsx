import React from "react"
import PropTypes from "prop-types"

import NavLink from "NavLink"

const DealNavMobile = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    render () {
        var dealId = this.props.deal.objectId;
        var colSize = "col-xs-3";
        var mobileNav =
        <div className="conatiner-fluid text-center hidden-lg hidden-md DealNavMobile">
            <NavLink tag="div" to={"/roosts/" + dealId + "/requirements" } className={colSize}>
                <div>
                    <i className="fa fa-list-ul fa-2x"></i>
                </div>
                <div className="title">
                    Requirements
                </div>
            </NavLink>
            <NavLink tag="div" to={"/roosts/" + dealId + "/participants" } className={colSize}>
                <div>
                    <i className="fa fa-users fa-2x"></i>
                </div>
                <div className="title">
                    Participants
                </div>
            </NavLink>
            <NavLink tag="div" to={"/roosts/" + dealId + "/budget" } className={colSize}>
                <div>
                    <i className="fa fa-info-circle fa-2x"></i>
                </div>
                <div className="title">
                    Overview
                </div>
            </NavLink>
            <NavLink tag="div" to={"/roosts/" + dealId + "/documents" } className={colSize}>
                <div>
                    <i className="fa fa-file fa-2x"></i>
                </div>
                <div className="title">
                    Documents
                </div>
            </NavLink>
        </div>

        return mobileNav;
    }
})

export default DealNavMobile
