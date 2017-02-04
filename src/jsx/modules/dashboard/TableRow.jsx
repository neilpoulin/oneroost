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
        }).isRequired
    },
    render () {
        const {deal,
            // stakeholders,
            //  comments,
            //  documents,
            nextSteps,
            archived
         } = this.props.opportunity

         let sortedSteps = nextSteps.filter(step => {
             return step.completedDate == null && step.active !== false
         }).sort((a, b) => {
            return a.dueDate > b.dueDate
         })
         let nextStep = null;
         if ( sortedSteps.length > 0 ){
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

        return (
            <tr className={archived? "archived" : ""}>
                <td>
                    <NavLink className="" to={"/roosts/" + deal.objectId}
                        tag="span"
                        activeClassName="active">
                        {deal.dealName}
                    </NavLink>
                </td>
                <td>
                    {deal.description}
                </td>
                <td>
                    {RoostUtil.formatDate(deal.updatedAt)}
                </td>
                <td>
                    {RoostUtil.getBudgetString(deal, "--")}
                </td>
                <td>
                    {nextStep}
                </td>
            </tr>
        )
    }
})

export default TableRow
