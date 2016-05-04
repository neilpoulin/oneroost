import React from "react"
import ParseReact from "parse-react";
import Parse from "parse";
import TimelineForm from "./../TimelineForm";

const TimelineSidebar = React.createClass({
    mixins: [ParseReact.Mixin],
    observe(){
        var dealQuery = (new Parse.Query("Deal")).equalTo("objectId", this.props.params.dealId);
        return {
            deal: dealQuery
        };
    },
    render(){
        if (this.pendingQueries() > 0) {
            return (
                <i className="fa fa-spin fa-spinner">Loading Deal</i>
            );
        }

        var deal = this.data.deal[0];
        var sidebar =
        <div className="TimelineSidebar">
            <h3 className="title">Timeline</h3>
            <TimelineForm timeline={deal.profile.timeline} deal={deal}/>
        </div>;

        return sidebar;
    }
});

export default TimelineSidebar
