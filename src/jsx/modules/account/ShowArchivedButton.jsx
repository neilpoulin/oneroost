import React from "react"
import PropTypes from "prop-types"
import {connect} from "react-redux"
import {Map} from "immutable"
import {showArchived, hideArchived} from "ducks/opportunities"
import ToggleButton from "ToggleButton"

const ShowArchivedButton = React.createClass({
    propTypes: {
        userId: PropTypes.string.isRequired,
        showArchived: PropTypes.func.isRequired,
        hideArchived: PropTypes.func.isRequired,
        archivedVisible: PropTypes.bool.isRequired,
    },
    getInitialState(){
        return {
            errors: {}
        }
    },

    handleArchivedClick(show){
        if ( show ){
            this.props.showArchived(this.props.userId)
        }
        else{
            this.props.hideArchived(this.props.userId)
        }
    },
    render () {
        const {archivedVisible} = this.props;
        let button =
        <ToggleButton
            label={"Show Archived: " + (archivedVisible ? "on" : "off")}
            onClick={this.handleArchivedClick}
            inactiveType={"outline-primary"}
            block={true}
            active={archivedVisible} />

        return button
    }
})

const mapStateToProps = (state, ownProps) => {
    let stateJS = Map(state).toJS()
    let userId = ownProps.userId
    let opportunities = stateJS.opportunitiesByUser[userId] || {}
    return {

        archivedVisible: opportunities.archivedVisible || false,
    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    let userId = ownProps.userId
    return {
        showArchived: () => {
            dispatch(showArchived(userId))
        },
        hideArchived: () => {
            dispatch(hideArchived(userId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowArchivedButton)
