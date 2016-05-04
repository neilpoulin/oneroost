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
        if ( this.data.nextSteps.length < 5 )
        {
            addButton = <AddNextStepButton deal={self.state.deal} />;
        }

        return (
            <div id="NextStepsBannerContainer" className="">
                    {this.data.nextSteps.map(function(step){
                        return (
                            <NextStepItem
                                step={step}
                                deal={self.state.deal}
                                key={"deal_" + self.state.deal.objectId + "step_" + step.objectId} >
                            </NextStepItem>
                        );
                    })}
                    {addButton}
            </div>
        );
    }
});
