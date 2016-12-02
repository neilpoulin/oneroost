import React, { PropTypes } from "react"
import Comments from "./../deal/Comments";
import FixedSidebar from "./FixedSidebar";

const DealPageBottom = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    render: function() {
        var deal = this.props.deal;
        var sidebar = null;
        if ( this.props.children )
        {
            sidebar =
            <FixedSidebar ref="sidebar">
                {this.props.children}
            </FixedSidebar>;
        }
        var pageBottom =
        <div className="DealPageBottom" ref="DealPageBottom">
            <Comments
                ref="comments"
                deal={deal} />
            {sidebar}
        </div>;

        return pageBottom;
    }
})

export default DealPageBottom
