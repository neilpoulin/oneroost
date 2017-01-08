import Parse from "parse"
import React, {PropTypes} from "react"
import NavLink from "NavLink"
// import RoostUtil from "RoostUtil"

const NextStepCompletedSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.instanceOf(Parse.Object),
        nextSteps: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
    },
    getDefaultProps(){
        return {
            nextSteps: []
        }
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
        let self = this;
        let {nextSteps, deal} = this.props;
        var completedSteps = nextSteps.filter(function( step ){
            return step.get("completedDate") != null;
        });

        var sidebar =
        <div>
            <h3>Completed Steps</h3>
            {completedSteps.map(function(step){
                var step =
                <NavLink tag="div" to={"/roosts/" + deal.id + "/steps/" + step.id }
                    className={ "NextStepSidebarItemContainer" }
                    key={"roost_" + deal.id + "_step_" + step.id + "_completed"} >
                    <div className="nextStepTitle">{step.get("title")}</div>
                    <div className="nextStepDueDate">
                        Completed Date: {self.formatDate(step.get("completedDate"))}
                    </div>
                </NavLink>
                return step;
            })}
        </div>

        return sidebar;
    }
})

export default NextStepCompletedSidebar
