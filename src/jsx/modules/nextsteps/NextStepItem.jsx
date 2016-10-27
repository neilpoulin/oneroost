import Parse from "parse";
import React from "react";
import NavLink from "./../NavLink";

export default React.createClass({
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
        var date = this.props.step.dueDate;
        if ( this.props.step.completedDate != null )
        {
            dateLabel = "Completed Date: ";
            date = this.props.step.completedDate;
        }

        var stepItem =

        <NavLink tag="div" to={"/roosts/" + this.props.deal.objectId + "/steps/" + this.props.step.objectId }
            className={"arrow-right NextStepItemContainer " + ( this.props.step.completedDate != null ? "complete " : "" ) + (this.state.active ? "active " : "")} >
            <div className="nextStepTitle">{this.props.step.title}</div>
            <div className="nextStepDueDate">
                {dateLabel} {this.formatDate(date)}
            </div>
        </NavLink>
        return stepItem;
    }
});
