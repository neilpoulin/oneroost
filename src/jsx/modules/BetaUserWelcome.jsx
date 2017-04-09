import React, {PropTypes} from "react"
import OpportunityTemplate from "profile/OpportunityTemplate"

const BetaUserWelcome = React.createClass({
    propTypes: {
        userId: PropTypes.string.isRequired,
        templates: PropTypes.arrayOf(PropTypes.object),
        templatesLoading: PropTypes.bool,
        archivedTemplates: PropTypes.arrayOf(PropTypes.object),
        emailVerified: PropTypes.bool,
    },
    getDefaultProps(){
        return {
            templates: []
        }
    },
    render () {
        const {templates, emailVerified} = this.props;
        let links = null
        let message = ""

        if ( !emailVerified ){
            message = "To get started, you need to verify your email address. Please check your inbox and follow the instructions there"
        } else {
            message = "You have successfully verified your email. "
        }

        if ( templates.length > 0){
            message = "Get started by sending one of the links below to your prospective partners."
            links = <div className="link-container">
                {templates.map((template, i) => {
                    return <OpportunityTemplate
                        template={template}
                        key={"template_" + i}
                        />
                })}
            </div>
        }

        let welcome =
        <div className="BetaUserWelcome">
            <h1>Welcome to OneRoost</h1>
            {message}
            {links}
        </div>
        return welcome;
    }
})

export default BetaUserWelcome
