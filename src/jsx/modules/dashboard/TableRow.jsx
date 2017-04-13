import React, { PropTypes } from "react"
import * as RoostUtil from "RoostUtil"
import NavLink from "NavLink"

const TableRow = React.createClass({
    propTypes: {
        opportunity: PropTypes.shape({
            deal: PropTypes.object,
            stakeholders: PropTypes.arrayOf(PropTypes.object),
            comments: PropTypes.arrayOf(PropTypes.object),
            documents: PropTypes.arrayOf(PropTypes.object),
            nextSteps: PropTypes.arrayOf(PropTypes.object)
        }).isRequired,
        currentUser: PropTypes.object.isRequired,
        showRequirements: PropTypes.bool,
        requirementHeadings: PropTypes.arrayOf(PropTypes.object).isRequired
    },
    render () {
        const {currentUser,
            opportunity,
            showRequirements,
            requirementHeadings,
        } = this.props;
        const {deal,
            // stakeholders,
            //  comments,
            //  documents,
            nextSteps,
            archived,
            requirements,
         } = opportunity

        let sortedSteps = nextSteps.filter(step => {
            return step.completedDate == null && step.active !== false
        }).sort((a, b) => {
            return a.dueDate > b.dueDate
        })
        let nextStep = null;
        if (sortedSteps.length > 0){
            let step = sortedSteps[0]
            nextStep =
             <div>
                    <div>
                        {step.title}
                    </div>
                    <div>
                        due {RoostUtil.formatDate(step.dueDate)}
                    </div>
             </div>
        }

        let templateCell = null
        if (!showRequirements){
            templateCell = <td>
                {deal.template ? deal.template.title : ""}
            </td>
        }

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
                        tag="span"
                        activeClassName="active">
                        {RoostUtil.getRoostDisplayName(deal, currentUser)}
                    </NavLink>
                </td>
                <td>
                    {deal.dealName}
                </td>
                <td>
                    {RoostUtil.formatDate(deal.lastActiveAt || deal.updatedAt)}
                </td>
                <td>
                    {RoostUtil.formatDurationAsDays(deal.createdAt)}
                </td>
                <td>
                    {RoostUtil.getBudgetString(deal, "--")}
                </td>
                <td>
                    {nextStep}
                </td>
                {templateCell}
                {requirementCells.map((req) => {
                    return req
                })}
            </tr>
        )
    }
})

export default TableRow
