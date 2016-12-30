import React from "react";
import ModalButton from "ModalButton";
import NextStepForm from "nextsteps/NextStepForm";

export default React.createClass({
    getInitialState: function(){
        return {};
    },
    getDefaultProps: function(){
        return {
            btnClassName: "btn-outline-secondary",
            modalTitle: "Add Next Step"
        }
    },
    openModal: function(){
        this.refs.nextStepModal.openModal();
    },
    render: function()
    {
        return (
            <ModalButton
                buttonText="Add Next Step"
                buttonIcon="plus"
                containerClass={this.props.containerClass}
                buttonClass={this.props.btnClassName}
                modalTitle={this.props.modalTitle}
                >
                <NextStepForm
                    ref="addNextStepForm"
                    deal={this.props.deal} />
            </ModalButton>
        )
    }
});
