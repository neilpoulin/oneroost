import React from "react";
import ModalButton from "ModalButton";
import StakeholderForm from "StakeholderForm";

export default React.createClass({
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
                deal={this.props.deal} />
        </ModalButton>


        return btn;
    }
});
