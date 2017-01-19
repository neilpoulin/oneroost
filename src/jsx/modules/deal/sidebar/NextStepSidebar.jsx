import React, { PropTypes } from "react"
import Parse from "parse";
import NextStepDetailForm from "NextStepDetailForm";


const NextStepSidebar = React.createClass({
    propTypes: {
        params: PropTypes.shape({
            dealId: PropTypes.any.isRequired,
            stepId: PropTypes.any.isRequired
        }).isRequired,
        //TODO: these props are required, but throw errors. Get them from redux store instead
        nextSteps: PropTypes.arrayOf(PropTypes.instanceOf(Parse.Object)),
        deal: PropTypes.instanceOf(Parse.Object)
    },
    getDefaultProps(){
        return {
            nextSteps: []
        }
    },
    render(){
        // var deal = this.data.deal[0];
        const {deal, nextSteps, params} = this.props;
        const {stepId} = params
        const step = nextSteps.find(step => step.objectId === stepId);

        var sidebar;
        if ( step )
        {
            let stepTitle = step.title;
            sidebar =
            <div className="NextStepSidebar" key={"step_details_" + stepId}>
                <h3 className="title">{stepTitle}</h3>
                <NextStepDetailForm
                    key={"stepForm_" + stepId}
                    step={step}
                    deal={deal}
                    />
            </div>
        }
        else{
            sidebar =
            <div className="NextStepSidebar" key={"step_not_found" }>
                <h3 className="title">No Step Selected</h3>
            </div>
        }

        return sidebar;
    }
});

export default NextStepSidebar
