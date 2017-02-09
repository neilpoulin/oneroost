import React, { PropTypes } from "react"
import * as RoostUtil from "RoostUtil"

const Introduction = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        nextStep: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired,
        template: PropTypes.object.isRequired,
    },

    render () {
        const {readyRoostUser, template, nextStep} = this.props;
        let page =
        <div>
            <div>
                <h2>Welcome to OneRoost</h2>
                <p className="lead">
                    You’re here because <b>{RoostUtil.getFullName(readyRoostUser)}</b> at <b>{readyRoostUser.company}</b> is using OneRoost to review business opportunities! With OneRoost, you will be able to present your offering in a simple and straightforward manner, accelerating the decision process.
                </p>
                <p className="lead">
                    RFP Title:
                    {template.title}
                </p>
                <p>
                    {template.description}
                </p>
            </div>
            <div className="actions">
                <button className="btn btn-primary btn-block" onClick={nextStep}>Get Started</button>
            </div>
        </div>

        return page
    }
})

export default Introduction
