import React, { PropTypes } from "react"
import NavLink from "NavLink"

const OpportunityTemplate = React.createClass({
    propTypes: {
        template: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
    },
    render () {
        const {template} = this.props;
        let widget =
        <div className="OpportunityTemplate">
            <div><b>{template.title}</b></div>
            <div>{template.description}</div>
            <div>
                <NavLink
                    to={"/proposals/" + template.objectId }
                    tag={"span"}
                    className={"PublicProfileLink"}
                    linkClassName={""}
                    >
                    link
                </NavLink>
            </div>
        </div>
        return widget
    }
})

export default OpportunityTemplate
