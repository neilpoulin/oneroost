import React from "react"
import PropTypes from "prop-types"
import NavLink from "NavLink"
import RequirementsInfo from "profile/RequirementsInfo"

const OpportunityTemplate = React.createClass({
    propTypes: {
        template: PropTypes.object.isRequired,
        user: PropTypes.object,
    },
    render () {
        const {template} = this.props;
        let linkDisplay = `${window.location.origin}/proposals/${template.objectId}`
        let widget =
        <div className="OpportunityTemplate">
            <div className="title">{template.title}</div>
            <div className="description">{template.description}</div>
            <div>
                <NavLink
                    to={"/proposals/" + template.objectId }
                    tag={"span"}
                    className={"PublicProfileLink"}
                    linkClassName={""}
                    target={"_blank"}
                    >
                    {linkDisplay}
                </NavLink>
            </div>
            <RequirementsInfo template={template} displayNumbered={true} forceList={true} editable={true} />
        </div>
        return widget
    }
})

export default OpportunityTemplate
