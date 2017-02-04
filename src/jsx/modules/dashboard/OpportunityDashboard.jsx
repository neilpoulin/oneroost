import Parse from "parse"
import React, {PropTypes} from "react"
import { connect } from "react-redux"
import RoostNav from "navigation/RoostNav"
import AddAccountButton from "account/AddAccountButton"
import BetaUserWelcome from "BetaUserWelcome"
import {loadOpportunities, subscribeOpportunities} from "ducks/opportunities"
import {setShowArchived} from "ducks/dashboard"
import OpportunitiesTable from "OpportunitiesTable"
import ToggleButton from "ToggleButton"
import LoadingIndicator from "LoadingIndicator"

const OpportunityDashboard = React.createClass({
    propTypes: {
        showTable: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired
    },
    componentDidMount(){
        this.props.loadData()
    },
    render () {
        const {showTable,
            userId,
            isLoading,
            setShowArchived,
            showArchived,
            hasArchivedDeals} = this.props
        let contents = null
        if ( isLoading ){
            contents = <LoadingIndicator message="Loading Dashboard" size="large"/>
        }
        else if ( !showTable ){
            contents = <BetaUserWelcome userId={userId}/>
        }
        else{
            contents = <OpportunitiesTable userId={userId}/>
        }

        let toggleArchivedButton = null
        if ( hasArchivedDeals){
            toggleArchivedButton =
            <ToggleButton
                label={"Show Archived: " + (showArchived ? "on" : "off")}
                onClick={setShowArchived}
                inactiveType={"outline-primary"}
                block={false}
                active={showArchived} />
        }

        return (
            <div className="OpportunityDashboard">
                <RoostNav showHome={false}/>
                <div className="secondaryNav container">
                    <h2>Dashboard</h2>
                    <div className="actions">
                        {toggleArchivedButton}
                        <AddAccountButton
                            onSuccess={this.afterAddAccount}
                            btnClassName="btn-outline-primary"
                            />
                    </div>

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
    let dashboard = state.dashboard.toJS()
    let userId = currentUser.id
    let myOpportunities = state.opportunitiesByUser.get(userId)
    let isLoading = true
    let showTable = false
    let hasArchivedDeals = false
    if ( myOpportunities ){
        myOpportunities = myOpportunities.toJS()
        isLoading = myOpportunities.isLoading
        showTable = myOpportunities.deals.length > 0 || myOpportunities.archivedDeals.length > 0
        hasArchivedDeals = myOpportunities.archivedDeals.length > 0
    }

    return {
        showTable,
        userId,
        isLoading,
        showArchived: dashboard.showArchived,
        hasArchivedDeals
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const currentUser = Parse.User.current()
    const userId = currentUser.id
    return {
        loadData: () => {
            dispatch(loadOpportunities(userId))
            dispatch(subscribeOpportunities(userId))
        },
        setShowArchived: (show) => {
            dispatch(setShowArchived(show))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunityDashboard)
