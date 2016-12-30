import React from "react"
import TimelineForm from "TimelineForm";

const TimelineSidebar = React.createClass({
    render(){
        var deal = this.props.deal;
        var sidebar =
        <div className="TimelineSidebar">
            <h3 className="title">Stage</h3>
            <TimelineForm timeline={deal.profile.timeline} deal={deal}/>
        </div>;

        return sidebar;
    }
});

export default TimelineSidebar
