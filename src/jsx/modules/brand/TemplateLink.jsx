import React from "react"
import PropTypes from "prop-types"
import {Link} from "react-router"
import ReactGA from "react-ga"

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
    _handleLinkClick(){
        const {department} = this.props;
        ReactGA.event({
            category: "Company",
            action: "Department Card Click",
            label: department ? department.value : "NOT_SET"
        });
    },
    render () {
        const {templateId, department} = this.props;
        if (!department){
            return null;
        }
        return (
            <Link className="department" to={`/proposals/${templateId}`} onClick={this._handleLinkClick}>
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
