import React, {PropTypes} from "react"
import {connect} from "react-redux"
import {Map} from "immutable"
import {denormalize} from "normalizr"
import OpportunityList from "account/OpportunityList"
import AddAccountButton from "account/AddAccountButton"
import * as Deal from "models/Deal"
import {showArchived, hideArchived} from "ducks/opportunities"
import ShowArchivedButton from "account/ShowArchivedButton"
import * as RoostUtil from "RoostUtil"

const AccountSidebar = React.createClass({
    propTypes: {
        deals: PropTypes.arrayOf(PropTypes.object).isRequired,
        archivedDeals: PropTypes.arrayOf(PropTypes.object),
        archivedVisible: PropTypes.bool.isRequired,
        currentUser: PropTypes.object.isRequired,
    },
    getDefaultProps: function(){
        return {
            isMobile: false,
            deals: [],
            archivedDeals: [],
            archivedVisible: false,
        }
    },
    getInitialState(){
        return {
            errors: {}
        }
    },
    onSuccess: function(){

    },
    render () {
        var {deals, archivedDeals, archivedVisible, currentUser} = this.props;
        let archivedButton = null
        if (archivedDeals.length > 0){
            archivedButton = <ShowArchivedButton userId={this.props.userId} />
        }

        return (
            <div id={"accountSidebar" + (this.props.isMobile ? "Mobile" : "")} className="container-fluid hidden-sm hidden-xs">
                <div>
                    <h3>Opportunities</h3>
                    {archivedButton}
                </div>

                <OpportunityList deals={deals} archivedDeals={archivedDeals} archivedVisible={archivedVisible} user={currentUser}/>
                <AddAccountButton
                    btnClassName="btn-outline-secondary btn-block"
                    onSuccess={this.onSuccess}
                    >
                    <i className="fa fa-plus">Create Account</i>
                </AddAccountButton>

            </div>
        )
    }
})


const mapStateToProps = (state, ownProps) => {
    let stateJS = Map(state).toJS()
    let currentUser = RoostUtil.getCurrentUser(state)
    let userId = stateJS.user.userId
    let entities = stateJS.entities
    let opportunities = stateJS.opportunitiesByUser[userId] || {}

    if ( stateJS.opportunitiesByUser[userId] ){
        opportunities.deals = denormalize(opportunities.deals, [Deal.Schema], entities)
        opportunities.archivedDeals = denormalize(opportunities.archivedDeals, [Deal.Schema], entities)
    }
    return {
        userId,
        currentUser,
        ...opportunities,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        showArchived: (userId) => {
            dispatch(showArchived(userId))
        },
        hideArchived: (userId) => {
            dispatch(hideArchived(userId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountSidebar)
