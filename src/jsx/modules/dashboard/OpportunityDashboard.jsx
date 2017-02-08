import Parse from "parse"
import React, {PropTypes} from "react"
import { connect } from "react-redux"
import RoostNav from "navigation/RoostNav"
import AddAccountButton from "account/AddAccountButton"
import BetaUserWelcome from "BetaUserWelcome"
import {loadOpportunities, subscribeOpportunities} from "ducks/opportunities"
import {setShowArchived, searchOpportunities} from "ducks/dashboard"
import OpportunitiesTable from "OpportunitiesTable"
import ToggleButton from "ToggleButton"
import LoadingIndicator from "LoadingIndicator"
import SearchInput from "SearchInput"
import * as RoostUtil from "RoostUtil"

const OpportunityDashboard = React.createClass({
    propTypes: {
        showTable: PropTypes.bool.isRequired,
        userId: PropTypes.string.isRequired,
        isLoading: PropTypes.bool.isRequired,
        currentUser: PropTypes.object,
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
            hasArchivedDeals,
            currentUser,
            doSearch} = this.props
        let contents = null
        if ( isLoading ){
            contents = <LoadingIndicator message="Loading Dashboard" size="large"/>
        }
        else if ( !showTable ){
            contents = <BetaUserWelcome userId={userId}/>
        }
        else{
            contents = <OpportunitiesTable userId={userId} currentUser={currentUser}/>
        }

        let toggleArchivedButton = null
        if ( hasArchivedDeals){
            toggleArchivedButton =
            <ToggleButton
                label={"Show Archived: " + (showArchived ? "on" : "off")}
                onClick={setShowArchived}
                activeType="link"
                className="btn-sm"
                inactiveType={"link"}
                block={false}
                active={showArchived} />
        }

        return (
            <div className="OpportunityDashboard">
                <RoostNav showHome={false}/>
                <div className="secondaryNav container">
                    <h2 className="hidden-sm hidden-xs">Dashboard</h2>
                    <div className="actions">
                        <SearchInput
                            onKeyUp={doSearch}
                            onSearch={doSearch}
                            />
                        {toggleArchivedButton}
                        <AddAccountButton
                            onSuccess={this.afterAddAccount}
                            btnClassName="btn-outline-primary btn-sm"
                            />
                    </div>

                </div>
                <div className="dashboard-body container table-responsive">
                    {contents}
               </div>
            </div>
        )
    }
})

const mapStateToProps = (state, ownProps) => {
    let dashboard = state.dashboard.toJS()
    let currentUser = RoostUtil.getCurrentUser(state)
    let userId = currentUser.objectId
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
        currentUser,
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
        },
        doSearch: (query) => {
            dispatch(searchOpportunities(query))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(OpportunityDashboard)
