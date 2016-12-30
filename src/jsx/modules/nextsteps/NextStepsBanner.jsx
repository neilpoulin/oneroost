import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import NavLink from "NavLink";
import AddNextStepButton from "nextsteps/AddNextStepButton";
import NextStepItem from "nextsteps/NextStepItem";

export default React.createClass({
    mixins: [ParseReact.Mixin],
    observe: function(props, state){
        return {
            nextSteps: new Parse.Query("NextStep").equalTo( "deal", props.deal ).ascending("dueDate")
        };
    },
    getInitialState: function(){
        return {
            deal: this.props.deal,
            user: Parse.User.current()
        };
    },
    render: function(){
        var addButton = <div className="width-0"></div>;
        var self = this;

        if ( this.pendingQueries().length > 0 )
        {
            return <div><i className="fa fa-spin fa-spinner"></i>Loading Steps...</div>
        }

        var completedSteps = [];
        var nextSteps = [];

        this.data.nextSteps.forEach(function(step){
            if ( step.completedDate == null ){
                nextSteps.push(step)
            }
            else{
                completedSteps.push(step)
            }
        });

        if ( nextSteps.length < 5 )
        {
            addButton = <div className="NextStepBannerItem AddStepContainer">
                <AddNextStepButton deal={self.state.deal} containerClass="AddNextStepButton"/>
            </div>
        }

        var completedStepsItem = null
        if ( completedSteps.length > 0 )
        {
            completedStepsItem =
            <NavLink tag="div" to={"/roosts/" + this.props.deal.objectId + "/steps/completed" }
                className={"NextStepBannerItem CompletedStepsContainer" + (this.state.active ? "active " : "")} >
                <div className="">{completedSteps.length} <i className="fa fa-check"></i></div>
            </NavLink>
        }

        var banner =
        <div id="NextStepsBannerContainer" className="">
            {completedStepsItem}
            <div className="NextStepBannerItem NextStepsContainer">
                {nextSteps.map(function(step){
                    var item =
                    <NextStepItem
                        step={step}
                        deal={self.state.deal}
                        key={"deal_" + self.state.deal.objectId + "step_" + step.objectId} >
                    </NextStepItem>
                    return item;
                })}
            </div>
            {addButton}
        </div>



        return banner
    }
});
