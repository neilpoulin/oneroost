import React, { PropTypes } from "react"
import {connect} from "react-redux"
import AddStakeholderButton from "AddStakeholderButton";
import Stakeholder from "Stakeholder"
import {removeStakeholder} from "ducks/roost/stakeholders"
import {archiveOpportunity} from "ducks/opportunities"
import {submitReadyRoost} from "ducks/roost/roost"

const StakeholderSidebar = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        stakeholders: PropTypes.arrayOf(PropTypes.object).isRequired,
        isLoading: PropTypes.bool.isRequired,
        removeStakeholder: PropTypes.func,
        submitReadyRoost: PropTypes.func,
    },
    getDefaultProps(){
        return {
            isLoading: true,
            stakeholders: [],
        }
    },
    getInitialState(){
        return {
            isEdit: false
        }
    },
    toggleEditStakeholders(){
        this.setState({isEdit: !this.state.isEdit});
    },
    render () {
        var {deal, stakeholders} = this.props;
        var isEdit = this.state.isEdit;
        var actionButton = <button className="btn btn-outline-secondary" onClick={this.toggleEditStakeholders}><i className="fa fa-minus"></i>&nbsp;Remove</button>
        if (isEdit){
            actionButton = <button className="btn btn-secondary" onClick={this.toggleEditStakeholders}><i className="fa fa-check"></i>&nbsp;Done</button>
        }

        let activeParticipants = stakeholders.filter(stakeholder => {
            return stakeholder.active !== false;
        });

        let inactiveParticipants = stakeholders.filter(stakeholder => {
            return stakeholder.active === false;
        });

        let inactiveBlock = null;
        if (inactiveParticipants.length > 0){
            inactiveBlock =
            <div className="inactive-participants">
                <h4>Inactive Participants</h4>
                {inactiveParticipants.map(stakeholder => {
                    return <Stakeholder key={"stakeholder_" + stakeholder.objectId}
                        stakeholder={stakeholder}
                        deal={deal}
                        isEdit={false}
                        removeStakeholder={this.props.removeStakeholder}
                        submitReadyRoost={this.props.submitReadyRoost}
                        />
                })}
            </div>
        }

        return (
            <div className="StakeholderSidebar">
                <h3 className="title">Participants</h3>
                <div className="stakeholder-actions">
                    {actionButton}
                    <AddStakeholderButton deal={deal}
                        btnClassName={"btn-primary btn-block " + (isEdit ? "disabled" : null)}
                        disabled={isEdit}
                        />
                </div>
                <div className="active-participants">
                    {activeParticipants.map(stakeholder => {
                        return <Stakeholder key={"stakeholder_" + stakeholder.objectId}
                            stakeholder={stakeholder}
                            deal={deal}
                            isEdit={isEdit}
                            removeStakeholder={this.props.removeStakeholder}
                            submitReadyRoost={this.props.submitReadyRoost}
                            />
                    })}
                </div>
                {inactiveBlock}
            </div>
        )
    }
});

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        removeStakeholder: (stakeholder) => {
            dispatch(removeStakeholder(stakeholder))
            dispatch(archiveOpportunity(stakeholder))
        },
        submitReadyRoost: (stakeholder, deal) => {
            dispatch(submitReadyRoost(stakeholder, deal))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StakeholderSidebar)
