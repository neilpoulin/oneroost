import React, { PropTypes } from "react"
import Parse from "parse"
import TableHeader from "TableHeader"
import TableRow from "TableRow"
import {denormalize} from "normalizr"
import {connect} from "react-redux"
import * as Deal from "models/Deal"
import {loadNextSteps} from "ducks/nextSteps"

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
    let deals = []
    let archivedDeals = []
    // let isLoading = true
    if ( myOpportunities ){
        myOpportunities = myOpportunities.toJS()
        // isLoading = myOpportunities.isLoading;
        deals = denormalize( myOpportunities.deals, [Deal.Schema], entities)
        archivedDeals = denormalize( myOpportunities.archivedDeals, [Deal.Schema], entities)
    }

    let opportunities = deals.map(deal => {
        return {
            deal: deal,
            archived: false
        }
    })
    let archivedOpportunities = archivedDeals.map(deal => {
        return {
            deal: deal,
            archived: true
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
            dealIds.forEach(id => {
                dispatch(loadNextSteps(id))
            })
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunitiesTable)
