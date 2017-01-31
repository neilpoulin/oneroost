import React, {PropTypes} from "react"
import NavLink from "NavLink"
import moment from "moment"
import AddNextStepButton from "nextsteps/AddNextStepButton"

const AllStepsSidebar = React.createClass({
    propTypes: {
        nextSteps: PropTypes.arrayOf(PropTypes.object).isRequired,
        deal: PropTypes.object
    },
    getDefaultProps(){
        return {
            nextSteps: [],
        }
    },
    formatDate: function( date )
    {
        return moment(date).format("M/D/YY")
    },
    render () {
        const {nextSteps, deal} = this.props;
        const self = this;

        var completedSteps = nextSteps.filter(function( step ){
            return step.completedDate != null;
        });

        var activeSteps = nextSteps.filter(function( step ){
            return step.completedDate == null;
        });

        var dealId = deal.objectId;


        var addStepsBtn = null;
        if ( activeSteps.length < 5 )
        {
            addStepsBtn = <AddNextStepButton deal={this.props.deal}
                containerClass=""
                btnClassName="btn-outline-primary btn-block"/>
        }

        var sidebar =
        <div>
            <h3>Active Steps</h3>
            <div>
                {activeSteps.map(function(step){
                    let {title, dueDate} = step
                    var step =
                    <NavLink tag="div" to={"/roosts/" + dealId + "/steps/" + step.objectId }
                            key={"deal_" + dealId + "_active_step_" + step.objectId}
                        className={ "NextStepSidebarItemContainer active" } >
                        <div className="nextStepTitle">{title}</div>
                        <div className="nextStepDueDate">
                            Due Date: {self.formatDate(dueDate)}
                        </div>
                    </NavLink>
                    return step;
                })}
            </div>
            <div>
                {addStepsBtn}
            </div>

            <h3>Completed Steps</h3>
            <div>
                {completedSteps.map(function(step){
                    var step =
                    <NavLink tag="div"
                        key={"deal_" + dealId + "_completed_step_" + step.objectId}
                        to={"/roosts/" + dealId + "/steps/" + step.objectId }
                        className={ "NextStepSidebarItemContainer" } >
                        <div className="nextStepTitle">{step.title}</div>
                        <div className="nextStepDueDate">
                            Completed Date: {self.formatDate(step.completedDate)}
                        </div>
                    </NavLink>
                    return step;
                })}
            </div>
        </div>

        return sidebar;
    }
})

export default AllStepsSidebar
