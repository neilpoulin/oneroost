import React, { PropTypes } from "react"
import NavLink from "NavLink"

const OpportunityTemplate = React.createClass({
    propTypes: {
        template: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
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
        </div>
        return widget
    }
})

export default OpportunityTemplate
