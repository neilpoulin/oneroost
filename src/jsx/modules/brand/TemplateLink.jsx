import React, { PropTypes } from "react"
import {Link} from "react-router"

const TemplateLink = React.createClass({
    propTypes: {
        template: PropTypes.shape({
            category: PropTypes.string.isRequired,
        }).isRequired,
    },
    render () {
        const {template} = this.props;
        return (
            <Link className="category" to={`/proposals/${template.templateId}`}>
                <span className="title">{template.category}</span>
                <ul className="list-unstyled list">
                    {template.services.map((service, i) =>
                        <li key={`service_${i}`}>{service}</li>
                    )}
                </ul>
            </Link>
        )
    }
})

export default TemplateLink
