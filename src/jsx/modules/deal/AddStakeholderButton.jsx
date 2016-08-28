import React from "react";
import ModalButton from "./../util/ModalButton";
import StakeholderForm from "./StakeholderForm";

export default React.createClass({
    getDefaultProps: function(){
        return {
            btnClassName: "btn-outline-secondary"
        }
    },
    openModal: function(){
        this.refs.addStakeholderModal.openModal();
    },
    render: function(){

        // var btn =
        // <div className="AddStakeholderButton">
        //     <div className="text-center">
        //         <button className={"btn " + btnClass}
        //             onClick={this.openModal}>
        //             Add Stakeholder
        //         </button>
        //     </div>
        //     <StakeholderModal
        //         deal={this.props.deal}
        //         onSuccess={this.props.onSuccess}
        //         ref="addStakeholderModal">
        //     </StakeholderModal>
        // </div>


        var btn = <ModalButton
            buttonText="Invite a Participant"
            buttonIcon="plus"
            containerClass="AddStakeholderButton"
            buttonClass={this.props.btnClassName}
            modalTitle="Invite a Participant"
            >
            <StakeholderForm
                ref="addStakeholderForm"
                deal={this.props.deal} />
        </ModalButton>


        return btn;
    }
});
