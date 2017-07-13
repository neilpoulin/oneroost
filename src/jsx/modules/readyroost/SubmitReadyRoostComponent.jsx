import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {submitReadyRoost} from "ducks/roost/roost"
import {formatDate} from "DateUtil"
import {denormalize} from "normalizr"
import * as Deal from "models/Deal"
import * as Stakeholder from "models/Stakeholder"
import {getFullName} from "RoostUtil"

const SubmitReadyRoostComponent = React.createClass({
    propTypes: {
        // passed props
        dealId: PropTypes.string.isRequired,
        // actions
        submitReadyRoost: PropTypes.func.isRequired,
        // computed
        approverStakeholder: PropTypes.object,
        deal: PropTypes.object,
        showSubmit: PropTypes.bool,
        showPending: PropTypes.bool,
        pendingText: PropTypes.string,
    },
    render () {
        const {submitReadyRoost, showSubmit, showPending, pendingText, deal, approverStakeholder} = this.props
        return (
            <div display-if={showSubmit || showPending} className="SubmitReadyRoostComponent">
                <button display-if={showSubmit}
                    onClick={() => submitReadyRoost(approverStakeholder, deal)}
                    className="btn btn-primary">
                    <i className="fa fa-check"></i> Submit Opportunity
                </button>
                <div className="inviteStatus" display-if={showPending}><span>{pendingText}</span></div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const {dealId} = ownProps
    const entities = state.entities.toJS()
    const roosts = state.roosts.toJS()

    const roost = roosts[dealId]
    const deal = denormalize(dealId, Deal.Schema, entities)
    let stakeholders = denormalize(roost.stakeholders.ids, [Stakeholder.Schema], entities)

    let approverStakeholder = stakeholders.find(s => {
        return s.readyRoostApprover
    })
    let showSubmit = false
    let showPending = false
    let pendingText = null
    if (approverStakeholder){
        showSubmit = !approverStakeholder.inviteAccepted && !deal.readyRoostSubmitted
        showPending = deal.readyRoostSubmitted && !approverStakeholder.inviteAccepted
        pendingText = showPending ? `Opportunity submitted to ${getFullName(approverStakeholder.user)} on ${formatDate(deal.readyRoostSubmitted)}` : ""
    }

    return {
        showSubmit,
        showPending,
        pendingText,
        approverStakeholder,
        deal,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        submitReadyRoost: (stakeholder, deal) => {
            dispatch(submitReadyRoost(stakeholder, deal))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SubmitReadyRoostComponent)
