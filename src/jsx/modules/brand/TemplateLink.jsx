import React, { PropTypes } from "react"
import {Link} from "react-router"

const TemplateLink = React.createClass({
    propTypes: {
        templateId: PropTypes.string.isRequired,
        department: PropTypes.shape({
            displayText: PropTypes.string.isRequired,
            categories: PropTypes.arrayOf(PropTypes.shape({
                displayText: PropTypes.string.isRequired,
                value: PropTypes.string.isRequired,
            })).isRequired,
        })
    },
    render () {
        const {templateId, department} = this.props;
        if (!department){
            return null;
        }
        return (
            <Link className="department" to={`/proposals/${templateId}`}>
                <span className="title">{department.displayText}</span>
                <ul className="list-unstyled list">
                    {department.categories.map((category, i) =>
                        <li key={`service_${i}`}>{category.displayText}</li>
                    )}
                </ul>
            </Link>
        )
    }
})

export default TemplateLink
