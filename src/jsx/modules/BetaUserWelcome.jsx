import React, {PropTypes} from "react"
import OpportunityTemplate from "profile/OpportunityTemplate"

const BetaUserWelcome = React.createClass({
    propTypes: {
        userId: PropTypes.string.isRequired,
        templates: PropTypes.arrayOf(PropTypes.object),
        templatesLoading: PropTypes.bool,
        archivedTemplates: PropTypes.arrayOf(PropTypes.object),
    },
    getDefaultProps(){
        return {
            templates: []
        }
    },
    render () {
        let {templates} = this.props;
        let links = null
        let message = "Congratulations on joining OneRoost. Get started by creating an opportunity with the button above."

        if ( templates.length > 0){
            message = "Congratulations on joining OneRoost. Get started by sending one of the links below to your prospective partners."
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
            {message}
            {links}
        </div>
        return welcome;
    }
})

export default BetaUserWelcome
