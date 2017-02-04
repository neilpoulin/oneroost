import React, { PropTypes } from "react"
import Parse from "parse"
import TableHeader from "TableHeader"
import TableRow from "TableRow"
import {denormalize} from "normalizr"
import {connect} from "react-redux"
import * as Deal from "models/Deal"
import * as NextStep from "models/NextStep"
import {loadNextStepsForDeals} from "ducks/nextSteps"

const headers = [
    {
        label: "Company",
        clickable: false,
        sortable: false,
    },
    {
        label: "Problem",
        clickable: false,
        sortable: false,
    },
    {
        label: "Last Activity",
        clickable: false,
        sortable: false,
    },
    {
        label: "Budget",
        clickable: false,
        sortable: false,
    },
    {
        label: "Next Step",
        clickable: false,
        sortable: false,
    }
]

const OpportunitiesTable = React.createClass({
    propTypes: {
        opportunities: PropTypes.arrayOf(PropTypes.shape({
            deal: PropTypes.object,
            stakeholders: PropTypes.arrayOf(PropTypes.object),
            comments: PropTypes.arrayOf(PropTypes.object),
            documents: PropTypes.arrayOf(PropTypes.object),
            nextSteps: PropTypes.arrayOf(PropTypes.object)
        })),
        userId: PropTypes.string.isRequired
    },
    getDefaultProps() {
        return {
            opportunities: []
        }
    },
    componentDidMount(){
        const {opportunities} = this.props
        const dealIds = opportunities.map(({deal}) => deal.objectId)
        this.props.loadNextSteps(dealIds)
    },
    componentWillUpdate(nextProps, nextState){
        const oldOpps = this.props.opportunities;
        const {opportunities=[]} = nextProps;
        if ( opportunities.length === oldOpps.length ){
            return
        }
        const dealIds = opportunities.map(({deal}) => deal.objectId)
        this.props.loadNextSteps(dealIds)
    },
    render () {
        const {opportunities} = this.props
        return (
            <table className="table OpportunitiesTable">
                <TableHeader columns={headers} />
                <tbody>
                    {opportunities.map((opp, i) => {
                        return <TableRow opportunity={opp} key={"opportunities_table_row_" + i}/>
                    })}
                </tbody>
            </table>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const currentUser = Parse.User.current()
    let userId = currentUser.id;
    let entities = state.entities.toJS()
    let myOpportunities = state.opportunitiesByUser.get(userId)
    let dashboard = state.dashboard.toJS()
    let deals = []
    let archivedDeals = []

    // let isLoading = true
    if ( myOpportunities ){
        myOpportunities = myOpportunities.toJS()
        // isLoading = myOpportunities.isLoading;
        deals = denormalize( myOpportunities.deals, [Deal.Schema], entities)
        archivedDeals = dashboard.showArchived ? denormalize( myOpportunities.archivedDeals, [Deal.Schema], entities) : []
    }

    let allDealIds = deals.concat(archivedDeals).map(deal => deal.objectId);
    let stepIds = Object.values(entities.nextSteps).filter(step => allDealIds.indexOf(step.deal) != -1)
    let nextSteps = denormalize(stepIds, [NextStep.Schema], entities)
    let nextStepsByDealId = nextSteps.reduce((group, step) => {
        let dealId = step.deal.objectId
        let steps = group[dealId] || []
        steps.push(step)
        group[dealId] = steps
        return group
    }, {})
    let opportunities = deals.map(deal => {
        return {
            deal: deal,
            archived: false,
            nextSteps: nextStepsByDealId[deal.objectId] || []
        }
    })
    let archivedOpportunities = archivedDeals.map(deal => {
        return {
            deal: deal,
            archived: true,
            nextSteps: nextStepsByDealId[deal.objectId] || []
        }
    })


    return {
        opportunities: opportunities.concat(archivedOpportunities),
        userId,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        loadNextSteps: (dealIds=[]) => {
            console.log("Loading next steps for deals", dealIds)
            dispatch(loadNextStepsForDeals(dealIds))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunitiesTable)
