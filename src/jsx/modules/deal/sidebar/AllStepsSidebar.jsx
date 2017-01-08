import Parse from "parse";
import React, {PropTypes} from "react";
import NavLink from "NavLink";
import AddNextStepButton from "nextsteps/AddNextStepButton";

const AllStepsSidebar = React.createClass({
    propTypes: {
        nextSteps: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)).isRequired,
        deal: PropTypes.instanceOf(Parse.Object).isRequired
    },
    getDefaultProps(){
        return {
            nextSteps: [],
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
        const {nextSteps, deal} = this.props;
        const self = this;

        var completedSteps = nextSteps.filter(function( step ){
            return step.completedDate != null;
        });

        var activeSteps = nextSteps.filter(function( step ){
            return step.completedDate == null;
        });

        var dealId = deal.id;


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
                    var step =
                    <NavLink tag="div" to={"/roosts/" + dealId + "/steps/" + step.id }
                            key={"deal_" + dealId + "_active_step_" + step.id}
                        className={ "NextStepSidebarItemContainer active" } >
                        <div className="nextStepTitle">{step.get("title")}</div>
                        <div className="nextStepDueDate">
                            Due Date: {self.formatDate(step.get("dueDate"))}
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
