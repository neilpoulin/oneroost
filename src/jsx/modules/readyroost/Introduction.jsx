import React from "react"
import PropTypes from "prop-types"
import * as RoostUtil from "RoostUtil"
import RequirementsInfo from "profile/RequirementsInfo"

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
        const requirements = template.requirements
        let requirementsInfo = null
        if (template.requirements && template.requirements.length > 0){
            let message = `There ${requirements.length > 1 ? "are" : "is"} ${requirements.length} requirement${requirements.length > 1 ? "s" : ""} for this opportunity`
            requirementsInfo = <RequirementsInfo
                requirements={requirements}
                message={message}
                displayNumbered={true}
                template={template}/>
        }
        let page =
        <div>
            <div>
                <h2>{template.title}</h2>
                <p className="lead">
                    {template.description}
                </p>
                <p className="">
                    You’re here because <b>{RoostUtil.getFullName(readyRoostUser)}</b> at <b>{template.account.accountName}</b> is using OneRoost to review business opportunities! With OneRoost, you will be able to present your offering in a simple and straightforward manner, accelerating the decision process.
                </p>
                {requirementsInfo}
            </div>
            <div className="actions">
                <button className="btn btn-primary btn-block" onClick={nextStep}>Get Started</button>
            </div>
        </div>

        return page
    }
})

export default Introduction
