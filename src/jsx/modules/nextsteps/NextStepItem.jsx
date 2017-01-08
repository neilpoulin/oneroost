import Parse from "parse";
import React, {PropTypes} from "react";
import NavLink from "NavLink";

const NextStepItem = React.createClass({
    propTypes: {
        deal: PropTypes.instanceOf(Parse.Object)
    },
    getInitialState: function(){
        return {
            deal: this.props.deal,
            user: Parse.User.current(),
            active: false
        };
    },
    formatDate: function( date )
    {
        if ( !(date instanceof Date) )
        {
            date = new Date( date );
        }

        var month = date.getMonth() + 1;
        return month + "/" + date.getDate() + "/" + date.getFullYear()
    },
    render: function(){
        var dateLabel = "Due"
        var date = this.props.step.get("dueDate");
        if ( this.props.step.get("completedDate") != null )
        {
            dateLabel = "Completed Date: ";
            date = this.props.step.get("completedDate");
        }

        var stepItem =

        <NavLink tag="div" to={"/roosts/" + this.props.deal.id + "/steps/" + this.props.step.id }
            className={"arrow-right NextStepItemContainer " + ( this.props.step.get("completedDate") != null ? "complete " : "" ) + (this.state.active ? "active " : "")} >
            <div className="nextStepTitle">{this.props.step.get("title")}</div>
            <div className="nextStepDueDate">
                {dateLabel} {this.formatDate(date)}
            </div>
        </NavLink>
        return stepItem;
    }
});

export default NextStepItem;
