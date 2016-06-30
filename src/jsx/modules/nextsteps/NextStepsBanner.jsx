import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
import NavLink from "./../NavLink";
import AddNextStepButton from "./AddNextStepButton";
import NextStepItem from "./NextStepItem";

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
            return <div id="NextStepsBannerContainer"><i className="fa fa-spin fa-spinner"></i>Loading Steps... </div>
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
            addButton = <AddNextStepButton deal={self.state.deal} containerClass="AddNextStepButton"/>;
        }

        var completedStepsItem = null
        if ( completedSteps.length > 0 )
        {
            completedStepsItem =
            <NavLink tag="div" to={"/roosts/" + this.props.deal.objectId + "/steps/completed" }
                className={"NextStepBannerItem CompletedStepsContainer col-sm-2" + (this.state.active ? "active " : "")} >
                <div className="nextStepTitle">Completed Steps</div>
                <div className="nextStepDueDate">{completedSteps.length}</div>
            </NavLink>
        }

        var banner =
        <div id="NextStepsBannerContainer" className="row">
            {completedStepsItem}
            <div className="NextStepBannerItem col-sm-10">
                {nextSteps.map(function(step){
                    var item =
                    <NextStepItem
                        step={step}
                        deal={self.state.deal}
                        key={"deal_" + self.state.deal.objectId + "step_" + step.objectId} >
                    </NextStepItem>
                    return item;
                })}
                {addButton}
            </div>
        </div>



        return banner
    }
});
