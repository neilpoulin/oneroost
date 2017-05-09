import React, {PropTypes} from "react";
import ModalButton from "ModalButton";
import StakeholderForm from "StakeholderForm";
import {connect} from "react-redux"
import {inviteUser} from "ducks/roost/stakeholders"

const AddStakeholderButton = React.createClass({
    propTypes: {
        deal: PropTypes.object.isRequired,
        btnClassName: PropTypes.string,
        disabled: PropTypes.bool,
    },
    getDefaultProps: function(){
        return {
            btnClassName: "btn-outline-secondary",
            disabled: false
        }
    },
    openModal: function(){
        this.refs.addStakeholderModal.openModal();
    },
    render: function(){
        var btn = <ModalButton
            buttonText="Invite "
            buttonIcon="plus"
            containerClass="AddStakeholderButton"
            buttonClass={this.props.btnClassName}
            modalTitle="Invite a Participant"
            disabled={this.props.disabled}
            >
            <StakeholderForm
                ref="addStakeholderForm"
                deal={this.props.deal}
                inviteUser={this.props.inviteUser} />
        </ModalButton>

        return btn;
    }
});

const mapStateToProps = (state, ownProps) => {
    return {

    }
}

const mapDispatchToProps = (dispatch, ownProps) => {
    const {deal} = ownProps
    return {
        inviteUser: (userInfo) => {
            dispatch(inviteUser(userInfo, deal))
        }
    }
}

const connectOpts = {
    withRef: true
}

export default connect(mapStateToProps, mapDispatchToProps, undefined, connectOpts)(AddStakeholderButton)
