import React, { PropTypes } from "react"
import ParseReact from "parse-react";
import Parse from "parse";
import NextStepForm from "./../NextStepForm";

const NextStepSidebar = React.createClass({
    mixins: [ParseReact.Mixin],
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.any.isRequired,
            stepId: PropTypes.any.isRequired
        }).isRequired
    },
    observe( props, state ){
        var dealQuery = (new Parse.Query("Deal")).equalTo("objectId", props.params.dealId);
        var stepQuery = (new Parse.Query("NextStep")).equalTo("objectId", props.params.stepId).include("assignedUser");
        return {
            deal: dealQuery,
            step: stepQuery
        };
    },
    render(){
        if (this.pendingQueries().length > 0) {
            var spinner = <div><i className="fa fa-spin fa-spinner"></i>Loading Step</div>;
            return spinner;
        }
        // var deal = this.data.deal[0];
        var step = this.data.step[0];
        var sidebar =
        <div className="NextStepSidebar" key={"step_" + step.objectId}>
            <h3 className="title">{step.title}</h3>
            <NextStepForm
                key={"stepForm_" + step.objectId}
                step={step}
                />
        </div>
        return sidebar;
    }
});

export default NextStepSidebar
