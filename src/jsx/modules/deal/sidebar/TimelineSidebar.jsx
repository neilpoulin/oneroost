import React, {PropTypes} from "react"
import Parse from "parse"
import TimelineForm from "TimelineForm"

const TimelineSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.instanceOf(Parse.Object)
    },
    render(){
        let {deal} = this.props;
        let sidebar =
        <div className="TimelineSidebar">
            <h3 className="title">Stage</h3>
            <TimelineForm timeline={deal.get("profile").timeline} deal={deal}/>
        </div>;

        return sidebar;
    }
});

export default TimelineSidebar
