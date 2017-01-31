import React, {PropTypes} from "react"
import TimelineForm from "TimelineForm"
import {connect} from "react-redux"
import {updateDeal} from "ducks/roost"
import {TIMELINE} from "SidebarTypes"

const TimelineSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.object
    },
    render(){
        let {deal} = this.props;
        let sidebar =
        <div className="TimelineSidebar">
            <h3 className="title">Stage</h3>
            <TimelineForm timeline={deal.profile.timeline} deal={deal} updateDeal={this.props.updateDeal}/>
        </div>;

        return sidebar;
    }
});


const mapStateToProps = (state, ownprops) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {

    return {
        updateDeal: (changes, message) => dispatch(updateDeal(ownProps.deal, changes, message, TIMELINE))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TimelineSidebar)
