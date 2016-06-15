import Parse from "parse";
import React from "react";
import ParseReact from "parse-react";
import NavLink from "./../../NavLink";

const NextStepCompletedSidebar = React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        var Deal = Parse.Object.extend("Deal");
        var deal = new Deal();
        deal.id = props.params.dealId;
        return {
            nextSteps: new Parse.Query("NextStep").equalTo( "deal", deal).ascending("dueDate")
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
    render () {
        if ( this.pendingQueries().length > 0 )
        {
            var spinner = <div><i className="fa fa-spinner fa-spin"></i> Loading steps...</div>
            return spinner;
        }

        var completedSteps = this.data.nextSteps.filter(function( step ){
            return step.completedDate != null;
        });

        var dealId = this.props.params.dealId;
        var self = this;
        var sidebar =
        <div>
            <h3>Completed Steps</h3>
            {completedSteps.map(function(step){
                var step =
                <NavLink tag="div" to={"/roosts/" + dealId + "/steps/" + step.objectId }
                    className={ "CompletedNextStepItemContainer" } >
                    <div className="nextStepTitle">{step.title}</div>
                    <div className="nextStepDueDate">
                        Completed Date: {self.formatDate(step.completedDate)}
                    </div>
                </NavLink>
                return step;
            })}
        </div>

        return sidebar;
    }
})

export default NextStepCompletedSidebar
