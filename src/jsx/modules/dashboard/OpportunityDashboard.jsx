import Parse from "parse"
import React, {PropTypes} from "react"
import { connect } from "react-redux"
import RoostNav from "navigation/RoostNav"
import AddAccountButton from "account/AddAccountButton"
import BetaUserWelcome from "BetaUserWelcome"
import {loadOpportunities, subscribeOpportunities} from "ducks/opportunities"
import OpportunitiesTable from "OpportunitiesTable"

const OpportunityDashboard = React.createClass({
    propTypes: {
        showTable: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired
    },
    componentDidMount(){
        this.props.loadData()
    },
    render () {
        const {showTable, userId} = this.props
        let contents = null
        if ( !showTable ){
            contents = <BetaUserWelcome userId={userId}/>
        }
        else{
            contents = <OpportunitiesTable userId={userId}/>
        }

        return (
            <div className="OpportunityDashboard">
                <RoostNav showHome={false}/>
                <div className="secondaryNav container">
                    <h2>Dashboard</h2>
                    <AddAccountButton
                        onSuccess={this.afterAddAccount}
                        btnClassName="btn-outline-primary"
                        />
                </div>
                <div className="dashboard-body container">
                    {contents}
               </div>

            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    const currentUser = Parse.User.current()
    let userId = currentUser.id;
    let myOpportunities = state.opportunitiesByUser.get(userId)
    let showTable = false
    if ( myOpportunities ){
        myOpportunities = myOpportunities.toJS()
        showTable = myOpportunities.deals.length > 0 || myOpportunities.acrivedDeals.length > 0
    }

    return {
        showTable,
        userId,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const currentUser = Parse.User.current()
    const userId = currentUser.id
    return {
        loadData: () => {
            dispatch(loadOpportunities(userId))
            dispatch(subscribeOpportunities(userId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunityDashboard)
