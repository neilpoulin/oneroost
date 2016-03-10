import React from 'react';
import Parse from 'parse';
import BootstrapModal from './../BootstrapModal';
import StakeholderForm from './StakeholderForm';
import {Modal, ModalClose} from 'react-modal-bootstrap';

export default React.createClass({
    getInitialState: function(){
        return {
            isOpen: false
        };
    },
    hideModal: function(){
        this.setState({
            isOpen: false
        });
        this.refs.addStakeholderForm.clear();
    },
    openModal: function(){
        this.setState({
            isOpen: true
        });
    },
    submit: function(){
        this.refs.addStakeholderForm.saveStakeholder();
        this.hideModal();
    },
    render: function(){
        var stakeholderForm = (
            <StakeholderForm
                ref="addStakeholderForm"
                deal={this.props.deal} />
        );

        return (
            <Modal isOpen={this.state.isOpen} onRequestHide={this.hideModal}>
                <div className='modal-header'>
                    <ModalClose onClick={this.hideModal}/>
                    <h4 className='modal-title'>Add a Stakeholder</h4>
                </div>
                <div className="modal-body">
                    {stakeholderForm}
                </div>
                <div className='modal-footer'>
                    <button className='btn btn-default' onClick={this.hideModal}>
                        Cancel
                    </button>
                    <button className='btn btn-primary' onClick={this.submit}>
                        Save changes
                    </button>
                </div>
            </Modal>
        )
    }
});
