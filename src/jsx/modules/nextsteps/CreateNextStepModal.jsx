import React from 'react';
import Parse from 'parse';
import BootstrapModal from './../BootstrapModal';
import NextStepForm from './NextStepForm';

export default React.createClass({
    getInitialState: function(){
        return {
            deal: this.props.deal
        };
    },
    openModal: function(){
        this.refs.addNextStepModal.open();
    },
    closeModal: function(){
        this.refs.addNextStepModal.close();
    },
    modalCancel: function(){
        this.closeModal();
        this.refs.addNextStepForm.clear();
    },
    modalConfirm: function(){
        this.refs.addNextStepForm.saveNextStep();
        this.closeModal();
    },
    render: function(){
        var nextStepForm = (
            <NextStepForm
                ref="addNextStepForm"
                deal={this.state.deal} />
        );

        return (
            <BootstrapModal
                ref="addNextStepModal"
                confirm="Add"
                cancel="Cancel"
                onCancel={this.modalCancel}
                onConfirm={this.modalConfirm}
                title={'Add a Next Step for ' + this.state.deal.dealName} >
                {nextStepForm}
            </BootstrapModal>
        )
    }
});
