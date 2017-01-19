import React, {PropTypes} from "react";
import NavLink from "NavLink";
import AddNextStepButton from "nextsteps/AddNextStepButton";
import NextStepItem from "nextsteps/NextStepItem";

const NextStepBanner = React.createClass({
    propTypes: {
        deal: PropTypes.object,
        stakeholders: PropTypes.arrayOf(PropTypes.object).isRequired,
        nextSteps: PropTypes.arrayOf(PropTypes.object).isRequired,
    },
    getDefaultProps(){
        return {
            nextSteps: []
        }
    },
    render: function(){
        const {deal, stakeholders, nextSteps} = this.props;
        var completedSteps = [];
        var activeSteps = [];

        nextSteps.forEach(function(step){
            if ( step.completedDate == null ){
                activeSteps.push(step)
            }
            else{
                completedSteps.push(step)
            }
        });

        var addButton = null;
        if ( activeSteps.length < 5 )
        {
            addButton = <div className="NextStepBannerItem AddStepContainer">
                <AddNextStepButton stakeholders={stakeholders}
                    deal={deal}
                    containerClass="AddNextStepButton"/>
            </div>
        }

        var completedStepsItem = null
        if ( completedSteps.length > 0 )
        {
            // TODO: dont think i need this... removed from the NavLink below
            // className={"NextStepBannerItem CompletedStepsContainer" + (this.state.active ? "active " : "")} >
            completedStepsItem =
            <NavLink tag="div" to={"/roosts/" + this.props.deal.id + "/steps/completed" }
                className={"NextStepBannerItem CompletedStepsContainer"} >
                <div className="">{completedSteps.length} <i className="fa fa-check"></i></div>
            </NavLink>
        }

        var banner =
        <div id="NextStepsBannerContainer" className="">
            {completedStepsItem}
            <div className="NextStepBannerItem NextStepsContainer">
                {activeSteps.map(step => {
                    var item =
                    <NextStepItem
                        step={step}
                        deal={deal}
                        key={"deal_" + deal.objectId + "step_" + step.objectId} >
                    </NextStepItem>
                    return item;
                })}
            </div>
            {addButton}
        </div>

        return banner;
    }
});

export default NextStepBanner;
