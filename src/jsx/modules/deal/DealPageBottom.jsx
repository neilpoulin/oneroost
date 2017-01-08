import React, { PropTypes } from "react"
import Parse from "parse"
import Comments from "Comments"
import FixedSidebar from "FixedSidebar"

const DealPageBottom = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        stakeholders: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
        nextSteps: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
        sidebar: PropTypes.any,
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
        const {deal, nextSteps, stakeholders} = this.props;
        var sidebar = null;
        var isOpen = false
        if ( this.props.sidebar )
        {
            var sidebarWithProps = null;
            sidebarWithProps = React.cloneElement(this.props.sidebar, {
                deal: deal,
                nextSteps: nextSteps,
                stakeholders: stakeholders
            });

            sidebar =
            <FixedSidebar ref="sidebar">
                {sidebarWithProps}
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
