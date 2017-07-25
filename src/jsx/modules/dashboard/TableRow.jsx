import React from "react"
import PropTypes from "prop-types"
import {
    getRoostDisplayName,
    getFullName,
} from "RoostUtil"

import {formatDurationAsDays, formatDate} from "DateUtil"
import {getBudgetString} from "CurrencyUtil"
import NavLink from "NavLink"
import RoostStatusToggle from "RoostStatusToggle"

const TableRow = React.createClass({
    propTypes: {
        opportunity: PropTypes.shape({
            deal: PropTypes.object,
            stakeholders: PropTypes.arrayOf(PropTypes.object),
            comments: PropTypes.arrayOf(PropTypes.object),
            documents: PropTypes.arrayOf(PropTypes.object),
        }).isRequired,
        currentUser: PropTypes.object.isRequired,
        showRequirements: PropTypes.bool,
        requirementHeadings: PropTypes.arrayOf(PropTypes.object).isRequired,
        departmentMap: PropTypes.object.isRequired,
        requestAccess: PropTypes.func.isRequired,
    },
    _getDepartmentDisplayName(){
        const {opportunity: {deal}, departmentMap} = this.props;
        if (!deal || !departmentMap){
            return ""
        }
        const {department} = deal;
        if (!department){
            return ""
        }
        return departmentMap.getIn([department, "displayText"])
    },
    _getCategoryDisplayName(){
        const {opportunity: {deal}, departmentMap} = this.props;
        if (!deal || !departmentMap){
            return ""
        }
        const {department, departmentCategory} = deal;
        if (!department){
            return ""
        }
        const categories = departmentMap.getIn([department, "categories"], [])
        const category = categories.find(cat => {
            return cat.get("value") === departmentCategory
        });
        return category ? category.get("displayText") : ""
    },
    _getSubCategoryDisplayName(){
        const {opportunity: {deal}, departmentMap} = this.props;
        if (!deal || !departmentMap){
            return ""
        }

        const {department, departmentCategory, departmentSubCategory} = deal;
        if (!department || !departmentCategory){
            return ""
        }
        const categories = departmentMap.getIn([department, "categories"], [])
        const category = categories.find(cat => {
            return cat.get("value") === departmentCategory
        });
        if (category){
            const subCategory = category.get("subCategories").find(subCat => {
                return subCat.get("value") === departmentSubCategory
            })
            return subCategory ? subCategory.get("displayText") : ""
        }
        return ""
    },
    render () {
        const {currentUser,
            opportunity,
            showRequirements,
            requirementHeadings,
            requestAccess,
        } = this.props;
        const {deal,
            // stakeholders,
            //  comments,
            //  documents,
            // nextSteps,
            archived,
            requirements=[],
        } = opportunity

        let requirementCells = []
        if (showRequirements && requirementHeadings && requirementHeadings.length > 0){
            requirementCells = requirementHeadings.map((heading, i) => {
                let requirement = requirements.find(req => {
                    return req.title.trim().toLowerCase() === heading.label.trim().toLowerCase()
                })
                let cell = <td key={`req_deal_${deal.objectId}_${i}`}>--</td>
                if (requirement){
                    let icon = <i className="fa fa-times not-completed"></i>
                    if (requirement.completedDate){
                        icon = <i className="fa fa-check completed"></i>
                    }
                    cell =
                    <td key={`req_cell_${requirement.objectId}_${i}` }
                        className="requirement"
                        data-value={requirement.completedDate ? true : false}>
                        {icon}
                    </td>
                }
                return cell;
            })
        }

        return (
            <tr className={archived? "archived" : ""}>
                <td>
                    <NavLink className="" to={"/roosts/" + deal.objectId}
                        display-if={opportunity.hasAccess}
                        tag="span"
                        activeClassName="active">
                        {getRoostDisplayName(deal, currentUser)}
                    </NavLink>
                    <div display-if={!opportunity.hasAccess}>
                        <p>{getRoostDisplayName(deal, currentUser)}</p>
                        <span display-if={!opportunity.accessRequested} className="btn btn-sm btn-outline-primary" onClick={requestAccess}>Request Access</span>
                        <span display-if={opportunity.accessRequested} className="" >Request Sent</span>
                    </div>

                </td>
                <td>
                    {this._getDepartmentDisplayName()}
                    <span display-if={this._getCategoryDisplayName()}> | {this._getCategoryDisplayName()}</span>
                    <span display-if={this._getSubCategoryDisplayName()}> | {this._getSubCategoryDisplayName()}</span>
                </td>
                <td>
                    <span display-if={deal.template}>
                        {getFullName(deal.template.ownedBy)} {deal.template.ownedBy.username}
                    </span>
                </td>
                <td>
                    {formatDate(deal.lastActiveAt || deal.updatedAt)}
                </td>
                <td>
                    {formatDurationAsDays(deal.createdAt)}
                </td>
                <td>
                    {getBudgetString(deal, "--")}
                </td>
                <td>
                    <RoostStatusToggle roostId={deal.objectId}
                        status={opportunity.deal.status}
                        isApprover={opportunity.isApprover}/>
                </td>
                {requirementCells.map((req) => {
                    return req
                })}
            </tr>
        )
    }
})

export default TableRow
