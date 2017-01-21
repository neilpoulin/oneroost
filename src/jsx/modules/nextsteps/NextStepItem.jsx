import Parse from "parse";
import React, {PropTypes} from "react";
import NavLink from "NavLink";
import moment from "moment"

const NextStepItem = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired
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
        return moment(date).format("M/D/YY")
    },
    render: function(){
        var dateLabel = "Due"
        let {step, deal} = this.props
        let {dueDate, completedDate, title} = step
        if ( completedDate )
        {
            dateLabel = "Completed Date: ";
            dueDate = completedDate
        }

        var stepItem =

        <NavLink tag="div" to={"/roosts/" + deal.objectId + "/steps/" + step.objectId }
            className={"arrow-right NextStepItemContainer " + ( completedDate ? "complete " : "" ) + (this.state.active ? "active " : "")} >
            <div className="nextStepTitle">{title}</div>
            <div className="nextStepDueDate">
                {dateLabel} {this.formatDate(dueDate)}
            </div>
        </NavLink>
        return stepItem;
    }
});

export default NextStepItem;
