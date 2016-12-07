import React, { PropTypes } from "react"
import Comments from "./../deal/Comments";
import FixedSidebar from "./FixedSidebar";

const DealPageBottom = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired
    },
    beforeOpen(){

    },
    afterOpen(){

    },
    beforeClose(){

    },
    afterClose(){

    },
    sidebarOpen: false,
    render: function() {
        var deal = this.props.deal;
        var sidebar = null;

        var isOpen = false
        if ( this.props.children )
        {
            sidebar =
            <FixedSidebar ref="sidebar">
                {this.props.children}
            </FixedSidebar>;
            isOpen = true;
        }

        this.sidebarOpen = isOpen

        var sidebarOpen = false;
        if ( sidebar ){
            sidebarOpen = true;
        }

        var pageBottom =
        <div className={"DealPageBottom " + (sidebarOpen ? "sidebar-open" : "")} ref="DealPageBottom">
            <Comments
                ref="comments"
                deal={deal}
                sidebarOpen={isOpen} />
            {sidebar}
        </div>

        return pageBottom;
    }
})

export default DealPageBottom
