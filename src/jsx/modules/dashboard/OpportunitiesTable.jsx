import React, { PropTypes } from "react"
import Parse from "parse"
import TableHeader from "TableHeader"
import TableRow from "TableRow"
import {denormalize} from "normalizr"
import {connect} from "react-redux"
import * as Deal from "models/Deal"
import * as NextStep from "models/NextStep"
import {loadNextStepsForDeals} from "ducks/nextSteps"
import _ from "lodash"

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

    let query = dashboard.searchTerm
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
            nextSteps: nextStepsByDealId[deal.objectId] || [],
            searchScore: 0,
        }
    })
    let archivedOpportunities = archivedDeals.map(deal => {
        return {
            deal: deal,
            archived: true,
            nextSteps: nextStepsByDealId[deal.objectId] || [],
            searchScore: 0,
        }
    })

    let allOpportunities = opportunities.concat(archivedOpportunities)
    if (query != null && query.trim()){
        query = query.trim().replace(/ +(?= )/g,"");
        let patterns = query.split(" ").map(word => new RegExp(_.escapeRegExp(word), "i"))

        allOpportunities = allOpportunities.filter(opp => {
            let {deal} = opp
            let fields = []
            fields.push(deal.dealName)
            fields.push(deal.description)

            let searchScore = fields.reduce((fieldScore, field) => {
                return fieldScore + patterns.reduce((patScore, pat) => {
                    return patScore + ( pat.test(field) ? 1 : 0 )
                }, 0)
            }, 0)
            opp.searchScore = searchScore;
            return searchScore > 0;
        })
    }

    allOpportunities = allOpportunities.sort((a, b) => {
        return b.searchScore - a.searchScore
    })

    return {
        opportunities: allOpportunities,
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
