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
        let dealId = deal.objectId
        var completedSteps = nextSteps.filter(function( step ){
            return step.completedDate != null;
        });

        var sidebar =
        <div>
            <h3>Completed Steps</h3>
            {completedSteps.map(function(step){
                let {title, completedDate} = step
                let stepId = step.objectId
                return (
                <NavLink tag="div" to={"/roosts/" + dealId + "/steps/" + stepId }
                    className={ "NextStepSidebarItemContainer" }
                    key={"roost_" + dealId + "_step_" + stepId + "_completed"} >
                    <div className="nextStepTitle">{title}</div>
                    <div className="nextStepDueDate">
                        Completed Date: {self.formatDate(completedDate)}
                    </div>
                </NavLink>)
            })}
        </div>

        return sidebar;
    }
})

export default NextStepCompletedSidebar
