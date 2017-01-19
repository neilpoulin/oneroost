import React, { PropTypes } from "react"
import RoostUtil from "RoostUtil"

const Introduction = React.createClass({
    propTypes: {
        readyRoostUser: PropTypes.object.isRequired,
        currentUser: PropTypes.object,
        nextStep: PropTypes.func.isRequired,
        previousStep: PropTypes.func.isRequired
    },

    render () {

        let page =
        <div>
            <div>
                <h2>Welcome to OneRoost</h2>
                <p className="lead">
                    You’re here because <b>{RoostUtil.getFullName(this.props.readyRoostUser)}</b> at <b>{this.props.readyRoostUser.company}</b> is using OneRoost to review business opportunities! With OneRoost, you will be able to present your offering in a simple and straightforward manner, accelerating the decision process.
                </p>
            </div>
            <div className="actions">
                <button className="btn btn-primary btn-block" onClick={this.props.nextStep}>Get Started</button>
            </div>
        </div>

        return page
    }
})

export default Introduction
