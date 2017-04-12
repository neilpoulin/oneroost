import React, {PropTypes} from "react"
import OpportunityTemplate from "profile/OpportunityTemplate"

const BetaUserWelcome = React.createClass({
    propTypes: {
        userId: PropTypes.string.isRequired,
        templates: PropTypes.arrayOf(PropTypes.object),
        templatesLoading: PropTypes.bool,
        archivedTemplates: PropTypes.arrayOf(PropTypes.object),
        emailVerified: PropTypes.bool,
        showTitle: PropTypes.bool,
        titleText: PropTypes.string,
    },
    getDefaultProps(){
        return {
            templates: [],
            showTitle: false,
            titleText: "Welcome to OneRoost"
        }
    },
    render () {
        const {templates, emailVerified, showTitle, titleText} = this.props;
        let links = null
        let message = ""

        if (!emailVerified){
            message = "To get started, you need to verify your email address. Please check your inbox and follow the instructions there"
        }
        else {
            message = "You have no opportunities yet."
        }

        if (templates.length > 0){
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
            <h1 display-if={showTitle}>{titleText}</h1>
            {message}
            {links}
        </div>  
        return welcome;
    }
})

export default BetaUserWelcome
