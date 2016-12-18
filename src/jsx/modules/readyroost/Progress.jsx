import React, { PropTypes } from "react"

const Progress = React.createClass({
    propTypes: {
        step: PropTypes.number.isRequired,
        totalSteps: PropTypes.number.isRequired,
        labels: PropTypes.array
    },
    getDefaultProps() {
        return {
            step: 1,
            labels: []
        }
    },
    render () {
        let labels = this.props.labels;
        let steps = [];
        let currentStep = this.props.step;
        for ( var i = 0; i < this.props.totalSteps; i++ ){
            let label = ""
            if ( labels.length >= steps.length ){
                label = labels[i];
            }
            let className = "";
            if ( i + 1 < currentStep ){
                className = "complete"
            }
            if ( i + 1 == currentStep ){
                className = "active"
            }
            steps.push({
                label: label,
                complete: i + 1 < currentStep,
                className: className
            })
        }
        let progress =
        <div className="Progress">
            {steps.map(function(step, index){
                var icon = null;
                if ( step.complete ){
                    icon = <i className="fa fa-check"></i>
                }
                return <div key={"step_" + index}
                    className={"step " + step.className}>
                    <div className="dot">
                        {icon}
                    </div>
                    <span className="step-label">{step.label}</span>
                </div>
            })}
        </div>
        return progress
    }
})

export default Progress
