import React from 'react';
import Parse from 'parse';
import BootstrapModal from './../BootstrapModal';
import StakeholderForm from './StakeholderForm';

export default React.createClass({
    getInitialState: function(){
        return {
            deal: this.props.deal
        };
    },
    openModal: function(){
        this.refs.addStakeholderModal.open();
    },
    closeModal: function(){
        this.refs.addStakeholderModal.close();
    },
    modalCancel: function(){
        this.closeModal();
        this.refs.addStakeholderForm.clear();
    },
    modalConfirm: function(){
        this.refs.addStakeholderForm.saveStakeholder();
        this.closeModal();
    },
    render: function(){
        var stakeholderForm = (
            <StakeholderForm
                ref="addStakeholderForm"
                deal={this.state.deal} />
        );

        return (
            <BootstrapModal
                ref="addStakeholderModal"
                confirm="Invite"
                cancel="Cancel"
                onCancel={this.modalCancel}
                onConfirm={this.modalConfirm}
                title={'Add a Stakeholder' } >
                {stakeholderForm}
            </BootstrapModal>
        )
    }
});
