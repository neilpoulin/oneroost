import React from "react"
import PropTypes from "prop-types"
import {getFullName} from "RoostUtil"
import {getUrl} from "LinkTypes"
import NavLink from "NavLink"

const RequirementsRow = React.createClass({
    propTypes: {
        requirement: PropTypes.shape({
            completedDate: PropTypes.any,
            objectId: PropTypes.string,
        }).isRequired,
        updateRequirement: PropTypes.func.isRequired,
        currentUser: PropTypes.object.isRequired,
        dealId: PropTypes.string.isRequired,
    },
    handleClick(e){
        const el = e.target;
        const value = el.checked
        const {currentUser, updateRequirement, requirement} = this.props
        let changes = {
            completedDate: value ? new Date() : null
        }
        let message = getFullName(currentUser) + " marked requirement " + requirement.title + " as " + (value ? "completed" : "not completed")
        updateRequirement(requirement, changes, message);
    },
    render () {
        const {requirement, dealId} = this.props
        const {completedDate, title, description, navLink} = requirement

        let action = null
        if (navLink){
            action = <NavLink tag="span" to={getUrl(navLink, dealId)} linkClassName="btn btn-outline-secondary btn-sm">
                {navLink.text || `Go to ${navLink.type}`}
            </NavLink>
        }
        return (
            <tr>
                <td>
                    <input type="checkbox"
                        onChange={e => this.handleClick(e, requirement)}
                        checked={completedDate ? true : false}
                        value={completedDate ? true : false}/>
                </td>
                <td>
                    <div className="title">{title}</div>
                    <div className="description">{description}</div>
                    {action}
                </td>
            </tr>
        )
    }
})

export default RequirementsRow
