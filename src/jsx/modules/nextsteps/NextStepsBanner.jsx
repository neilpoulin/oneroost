import React from "react";
import Parse from "parse";
import ParseReact from "parse-react";
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
            return <div><i className="fa fa-spin fa-spinner"></i>Loading Steps... </div>
        }

        if ( this.data.nextSteps.length < 5 )
        {
            addButton = <AddNextStepButton deal={self.state.deal} />;
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

        var banner =
        <div id="NextStepsBannerContainer" className="">
            <div className="CompletedStepsContainer">
                Completed Steps: {completedSteps.length}
            </div>
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



        return banner
    }
});
