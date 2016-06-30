import React, { PropTypes } from "react"
import NavLink from "./../NavLink";

const DealNavMobile = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    render () {
        var dealId = this.props.deal.objectId;
        var colSize = "col-xs-3";
        var mobileNav =
        <div {...this.props} className="conatiner-fluid text-center visible-xs DealNavMobile">
            <NavLink tag="div" to={"/roosts/" + dealId + "/messages" } className={colSize}>
                <div>
                    <i className="fa fa-comments fa-2x"></i>
                </div>
                <div className="title">
                    Messages
                </div>
            </NavLink>
            <NavLink tag="div" to={"/roosts/" + dealId + "/steps" } className={colSize}>
                <div>
                    <i className="fa fa-map-signs fa-2x"></i>
                </div>
                <div className="title">
                    Next&nbsp;Steps
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
                    <i className="fa fa-money fa-2x"></i>
                </div>
                <div className="title">
                    Investment
                </div>
            </NavLink>
        </div>


        return mobileNav;
    }
})

export default DealNavMobile
